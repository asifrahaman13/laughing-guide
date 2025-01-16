package service

import (
	"fmt"
	"strings"

	"github.com/asifrahaman13/laughing-guide/src/core/domain"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/asifrahaman13/laughing-guide/src/helper"
	"github.com/asifrahaman13/laughing-guide/src/repository"
)

type employeeService struct {
	employeeRepository repository.EmployeeRepository
}

func NewEmployeeService(employeeRepository repository.EmployeeRepository) ports.EmployeeService {
	return &employeeService{employeeRepository}
}

func (s *employeeService) CalculatePayroll() (any, error) {
	rows, err := s.employeeRepository.Execute("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []any
	tx, err := s.employeeRepository.BeginTransaction()
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	var insertValues []interface{}
	insertQuery := `
        INSERT INTO payroll_data
        (employee_id, gross_salary, net_salary, employee_contribution, employer_contribution, total_contribution, bonuses)
        VALUES `

	for rows.Next() {
		var employee domain.Employee
		var salary float64
		var age int
		var bonuses float64

		err := rows.Scan(&employee.EmployeeID, &employee.EmployeeProfile, &employee.EmployeeEmail, &employee.EmployeeName, &employee.EmployeeRole, &employee.EmployeeStatus, &salary, &employee.EmployeeJobType, &employee.EmployeeResident, &age, &bonuses)
		if err != nil {
			return nil, err
		}

		isCitizen := employee.EmployeeResident == "Citizen"
		cpf := helper.CalculateCPF(age, salary, isCitizen)

		grossSalary := salary + bonuses
		netSalary := grossSalary - cpf.TotalContribution

		result := map[string]interface{}{
			"employeeId":       employee.EmployeeID,
			"employeeName":     employee.EmployeeName,
			"employeeSalary":   salary,
			"bonuses":          bonuses,
			"cpfContributions": cpf,
			"grossSalary":      grossSalary,
			"netSalary":        netSalary,
		}

		results = append(results, result)

		insertQuery += fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d), ", len(insertValues)+1, len(insertValues)+2, len(insertValues)+3, len(insertValues)+4, len(insertValues)+5, len(insertValues)+6, len(insertValues)+7)
		insertValues = append(insertValues, employee.EmployeeID, grossSalary, netSalary, cpf.EmployeeContribution, cpf.EmployerContribution, cpf.TotalContribution, bonuses)
	}

	insertQuery = insertQuery[:len(insertQuery)-2]
	_, err = tx.Exec(insertQuery+" ON CONFLICT (employee_id) DO UPDATE SET gross_salary = EXCLUDED.gross_salary, net_salary = EXCLUDED.net_salary, employee_contribution = EXCLUDED.employee_contribution, employer_contribution = EXCLUDED.employer_contribution, total_contribution = EXCLUDED.total_contribution, bonuses = EXCLUDED.bonuses", insertValues...)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return results, nil
}

func (s *employeeService) AllPayroll() (any, error) {
	rows, err := s.employeeRepository.Execute(`
        SELECT
            p.employee_id,
            p.gross_salary,
            p.net_salary,
            p.employee_contribution,
            p.employer_contribution,
            p.total_contribution,
            p.bonuses,
            e.employee_salary,
            e.employee_email,
            e.employee_name
        FROM payroll_data p
        JOIN employees e ON p.employee_id = e.employee_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var payrollResults []map[string]interface{}
	truncateToTwoDecimals := helper.TruncateToTwoDecimals

	for rows.Next() {
		var employeeID string
		var grossSalary, netSalary, employeeContribution, employerContribution, totalContribution, bonuses, salary float64
		var email, name string

		err := rows.Scan(&employeeID, &grossSalary, &netSalary, &employeeContribution, &employerContribution, &totalContribution, &bonuses, &salary, &email, &name)
		if err != nil {
			return nil, err
		}
		grossSalary = truncateToTwoDecimals(grossSalary)
		netSalary = truncateToTwoDecimals(netSalary)
		employeeContribution = truncateToTwoDecimals(employeeContribution)
		employerContribution = truncateToTwoDecimals(employerContribution)
		totalContribution = truncateToTwoDecimals(totalContribution)
		bonuses = truncateToTwoDecimals(bonuses)
		salary = truncateToTwoDecimals(salary)

		payroll := map[string]interface{}{
			"employeeId":           employeeID,
			"grossSalary":          grossSalary,
			"netSalary":            netSalary,
			"employeeContribution": employeeContribution,
			"employerContribution": employerContribution,
			"totalContribution":    totalContribution,
			"bonuses":              bonuses,
			"salary":               salary,
			"employeeEmail":        email,
			"employeeName":         name,
		}

		payrollResults = append(payrollResults, payroll)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return payrollResults, nil
}

func (s *employeeService) AllEmployees() (any, error) {
	rows, err := s.employeeRepository.Execute("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var employees []domain.Employee

	for rows.Next() {
		var employee domain.Employee
		err := rows.Scan(&employee.EmployeeID, &employee.EmployeeProfile, &employee.EmployeeEmail, &employee.EmployeeName, &employee.EmployeeRole, &employee.EmployeeStatus, &employee.EmployeeSalary, &employee.EmployeeJobType, &employee.EmployeeResident, &employee.EmployeeAge, &employee.Bonuses)
		if err != nil {
			return nil, err
		}
		employees = append(employees, employee)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return employees, nil
}

func (s *employeeService) EmployeeStatistics() (any, error) {
	rows, err := s.employeeRepository.Execute("SELECT employee_resident, employee_job_type, employee_status FROM employees")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	nationalityCount := map[string]int{
		"Singaporean": 0,
		"PR":          0,
		"Foreigner":   0,
		"Others":      0,
	}
	employmentTypeCount := map[string]int{
		"FullTime": 0,
		"PartTime": 0,
		"Intern":   0,
		"Contract": 0,
	}
	employeeStatusCount := map[string]int{
		"Active":       0,
		"Invite Sent":  0,
		"Payroll Only": 0,
	}

	for rows.Next() {
		var resident, jobType, status string
		err := rows.Scan(&resident, &jobType, &status)
		if err != nil {
			return nil, err
		}

		switch resident {
		case "Citizen":
			nationalityCount["Singaporean"]++
		case "PR":
			nationalityCount["PR"]++
		case "Foreigner":
			nationalityCount["Foreigner"]++
		default:
			nationalityCount["Others"]++
		}

		switch jobType {
		case "Full-time":
			employmentTypeCount["FullTime"]++
		case "Part-time":
			employmentTypeCount["PartTime"]++
		case "Intern":
			employmentTypeCount["Intern"]++
		case "Contract":
			employmentTypeCount["Contract"]++
		}

		switch status {
		case "Active":
			employeeStatusCount["Active"]++
		case "Invite Sent":
			employeeStatusCount["Invite Sent"]++
		case "Payroll Only":
			employeeStatusCount["Payroll Only"]++
		}
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return map[string]map[string]int{
		"Nationality":    nationalityCount,
		"EmploymentType": employmentTypeCount,
		"EmployeeStatus": employeeStatusCount,
	}, nil
}

func (s *employeeService) FilterEmployees(employeeName string, employeeStatus string, employeeJobType string) (any, error) {
	query := `
        SELECT employee_id, employee_profile, employee_email, employee_name, employee_role,
               employee_status, employee_salary, employee_job_type, employee_resident,
               employee_age, bonuses
        FROM employees
        WHERE employee_name ILIKE $1 AND employee_status ILIKE $2 AND employee_job_type ILIKE $3
    `

	result := make([]domain.Employee, 0)

	rows, err := s.employeeRepository.Execute(query, "%"+employeeName+"%", "%"+employeeStatus+"%", "%"+employeeJobType+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var employee domain.Employee
		err := rows.Scan(
			&employee.EmployeeID, &employee.EmployeeProfile, &employee.EmployeeEmail,
			&employee.EmployeeName, &employee.EmployeeRole, &employee.EmployeeStatus,
			&employee.EmployeeSalary, &employee.EmployeeJobType, &employee.EmployeeResident,
			&employee.EmployeeAge, &employee.Bonuses,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, employee)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *employeeService) DeleteEmployees(employeeIds []string) ([]domain.Employee, error) {
	ids := "'" + strings.Join(employeeIds, "','") + "'"
	query := fmt.Sprintf("DELETE FROM employees WHERE employee_id IN (%s)", ids)

	_, err := s.employeeRepository.Execute(query)
	if err != nil {
		return nil, err
	}
	updatedQuery := `
        SELECT employee_id, employee_profile, employee_email, employee_name, employee_role,
               employee_status, employee_salary, employee_job_type, employee_resident,
               employee_age, bonuses
        FROM employees
    `
	rows, err := s.employeeRepository.Execute(updatedQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var updatedEmployees []domain.Employee
	for rows.Next() {
		var employee domain.Employee
		err := rows.Scan(
			&employee.EmployeeID, &employee.EmployeeProfile, &employee.EmployeeEmail,
			&employee.EmployeeName, &employee.EmployeeRole, &employee.EmployeeStatus,
			&employee.EmployeeSalary, &employee.EmployeeJobType, &employee.EmployeeResident,
			&employee.EmployeeAge, &employee.Bonuses,
		)
		if err != nil {
			return nil, err
		}
		updatedEmployees = append(updatedEmployees, employee)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return updatedEmployees, nil
}
