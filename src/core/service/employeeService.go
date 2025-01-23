package service

import (
	"fmt"
	"strings"

	"github.com/asifrahaman13/laughing-guide/src/core/domain"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/asifrahaman13/laughing-guide/src/repository"
)

type employeeService struct {
	employeeRepository repository.DatabaseRepository
}

func NewEmployeeService(employeeRepository repository.DatabaseRepository) ports.EmployeeService {
	return &employeeService{employeeRepository}
}

const maxParameters = 65535

func (s *employeeService) ValidateOrganization(organizationId string, organizationEmail string) error {
	var count int
	err := s.employeeRepository.QueryRow(`
        SELECT COUNT(*)
        FROM organizations
        WHERE organization_id = $1 AND organization_email = $2
    `, organizationId, organizationEmail).Scan(&count)
	if err != nil {
		return err
	}
	if count == 0 {
		return fmt.Errorf("organization email does not belong to the organization ID")
	}
	return nil
}

func (s *employeeService) AllEmployees(organizationId string, organizationEmail string) ([]domain.Employee, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return nil, err
	}

	rows, err := s.employeeRepository.Execute("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees WHERE organization_id = $1", organizationId)
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

func (s *employeeService) EmployeeStatistics(organizationId string, organizationEmail string) (map[string]interface{}, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return nil, err
	}

	rows, err := s.employeeRepository.Execute("SELECT employee_resident, employee_job_type, employee_status FROM employees WHERE organization_id = $1", organizationId)

	if err != nil {
		return nil, err
	}
	orgRows, err := s.employeeRepository.Execute("SELECT organization_name FROM organizations WHERE organization_id = $1", organizationId)
	if err != nil {
		return nil, err
	}
	defer orgRows.Close()

	var organizationName string
	if orgRows.Next() {
		if err := orgRows.Scan(&organizationName); err != nil {
			return nil, err
		}
	} else {
		return nil, fmt.Errorf("no organization found with id: %s", organizationId)
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
		case "Full time":
			employmentTypeCount["FullTime"]++
		case "Part time":
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

	fmt.Println(organizationName)

	return map[string]interface{}{
		"OrganizationName": organizationName,
		"Nationality":      nationalityCount,
		"EmploymentType":   employmentTypeCount,
		"EmployeeStatus":   employeeStatusCount,
	}, nil
}

func (s *employeeService) FilterEmployees(employeeName string, employeeStatus string, employeeJobType string, organizationId string, organizationEmail string) ([]domain.Employee, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return nil, err
	}
	query := `
        SELECT employee_id, employee_profile, employee_email, employee_name, employee_role,
               employee_status, employee_salary, employee_job_type, employee_resident,
               employee_age, bonuses
        FROM employees
        WHERE employee_name ILIKE $1 AND employee_status ILIKE $2 AND employee_job_type ILIKE $3
        AND organization_id = $4
    `

	result := make([]domain.Employee, 0)

	rows, err := s.employeeRepository.Execute(query, "%"+employeeName+"%", "%"+employeeStatus+"%", "%"+employeeJobType+"%", organizationId)
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

func (s *employeeService) UpdateEmployees(employee domain.Employee, organizationId string, organizationEmail string) ([]domain.Employee, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return nil, err
	}
	var params []interface{}
	query := "UPDATE employees SET "
	var setClauses []string
	if employee.EmployeeProfile != "" {
		setClauses = append(setClauses, fmt.Sprintf("employee_profile=$%d", len(params)+1))
		params = append(params, employee.EmployeeProfile)
	}
	if employee.EmployeeName != "" {
		setClauses = append(setClauses, fmt.Sprintf("employee_name=$%d", len(params)+1))
		params = append(params, employee.EmployeeName)
	}
	if employee.EmployeeEmail != "" {
		setClauses = append(setClauses, fmt.Sprintf("employee_email=$%d", len(params)+1))
		params = append(params, employee.EmployeeEmail)
	}
	if employee.EmployeeRole != "" {
		setClauses = append(setClauses, fmt.Sprintf("employee_role=$%d", len(params)+1))
		params = append(params, employee.EmployeeRole)
	}
	if employee.EmployeeStatus != "" {
		setClauses = append(setClauses, fmt.Sprintf("employee_status=$%d", len(params)+1))
		params = append(params, employee.EmployeeStatus)
	}

	if len(setClauses) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	query += fmt.Sprintf("%s WHERE employee_id=$%d",
		strings.Join(setClauses, ", "),
		len(params)+1)
	params = append(params, employee.EmployeeID)

	_, err := s.employeeRepository.Execute(query, params...)
	if err != nil {
		return nil, err
	}
	return s.AllEmployees(organizationId, organizationEmail)
}

func (s *employeeService) DeleteEmployees(employeeIds []string, organizationId string, organizationEmail string) ([]domain.Employee, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return nil, err
	}
	ids := "'" + strings.Join(employeeIds, "','") + "'"
	query := fmt.Sprintf("DELETE FROM employees WHERE employee_id IN (%s) AND organization_id='%s'", ids, organizationId)
	_, err := s.employeeRepository.Execute(query)
	if err != nil {
		return nil, err
	}

	deletePayroll := fmt.Sprintf("DELETE FROM payroll_data WHERE employee_id IN (%s)", ids)
	_, err = s.employeeRepository.Execute(deletePayroll)

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
