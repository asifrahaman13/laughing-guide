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
	employeeRepository repository.DatabaseRepository
}

func NewEmployeeService(employeeRepository repository.DatabaseRepository) ports.EmployeeService {
	return &employeeService{employeeRepository}
}

const maxParameters = 65535

func (s *employeeService) CalculatePayroll(organizationId string) ([]domain.PayrollData, error) {
	rows, err := s.employeeRepository.Execute("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees WHERE organization_id = $1", organizationId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []domain.PayrollData
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

	batchSize := maxParameters / 7 // 7 parameters per row
	var batchCount int

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

		result := domain.PayrollData{
			EmployeeID:       employee.EmployeeID,
			EmployeeName:     employee.EmployeeName,
			EmployeeSalary:   salary,
			Bonuses:          bonuses,
			CPFContributions: cpf,
			GrossSalary:      grossSalary,
			NetSalary:        netSalary,
		}

		results = append(results, result)

		insertQuery += fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d), ", len(insertValues)+1, len(insertValues)+2, len(insertValues)+3, len(insertValues)+4, len(insertValues)+5, len(insertValues)+6, len(insertValues)+7)
		insertValues = append(insertValues, employee.EmployeeID, grossSalary, netSalary, cpf.EmployeeContribution, cpf.EmployerContribution, cpf.TotalContribution, bonuses)

		batchCount++
		if batchCount >= batchSize {
			insertQuery = insertQuery[:len(insertQuery)-2] // Remove last comma and space
			if _, err = tx.Exec(insertQuery+" ON CONFLICT (employee_id) DO UPDATE SET gross_salary = EXCLUDED.gross_salary, net_salary = EXCLUDED.net_salary, employee_contribution = EXCLUDED.employee_contribution, employer_contribution = EXCLUDED.employer_contribution, total_contribution = EXCLUDED.total_contribution, bonuses = EXCLUDED.bonuses", insertValues...); err != nil {
				return nil, err
			}

			// Reset for the next batch
			insertQuery = `
            INSERT INTO payroll_data
            (employee_id, gross_salary, net_salary, employee_contribution, employer_contribution, total_contribution, bonuses)
            VALUES `
			insertValues = nil
			batchCount = 0
		}
	}

	// Insert any remaining values
	if batchCount > 0 {
		insertQuery = insertQuery[:len(insertQuery)-2] // Remove last comma and space
		if _, err = tx.Exec(insertQuery+" ON CONFLICT (employee_id) DO UPDATE SET gross_salary = EXCLUDED.gross_salary, net_salary = EXCLUDED.net_salary, employee_contribution = EXCLUDED.employee_contribution, employer_contribution = EXCLUDED.employer_contribution, total_contribution = EXCLUDED.total_contribution, bonuses = EXCLUDED.bonuses", insertValues...); err != nil {
			return nil, err
		}
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return results, nil
}

func (s *employeeService) GetSingleOrganization(organizationEmail string) (domain.Organizations, error) {

	rows, err := s.employeeRepository.Execute("SELECT organization_id, organization_name, organization_email FROM organizations WHERE organization_email = $1", organizationEmail)
	if err != nil {
		return domain.Organizations{}, err
	}
	defer rows.Close()

	var organization domain.Organizations
	if rows.Next() {
		err := rows.Scan(&organization.OrganizationID, &organization.OrganizationName, &organization.OrganizationEmail)
		if err != nil {
			return domain.Organizations{}, err
		}
	}

	if err = rows.Err(); err != nil {
		return domain.Organizations{}, err
	}

	return organization, nil

}

func (s *employeeService) AllPayroll(organizationId string) ([]domain.EmployeePayrolls, error) {
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
        JOIN employees e ON p.employee_id = e.employee_id
        AND e.organization_id = $1
        `, organizationId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var payrollResults []domain.EmployeePayrolls
	truncateToTwoDecimals := helper.TruncateToTwoDecimals

	for rows.Next() {
		var payroll domain.EmployeePayrolls

		err := rows.Scan(&payroll.EmployeeID, &payroll.GrossSalary, &payroll.NetSalary, &payroll.EmployeeContribution, &payroll.EmployerContribution, &payroll.TotalContribution, &payroll.Bonuses, &payroll.Salary, &payroll.EmployeeEmail, &payroll.EmployeeName)
		if err != nil {
			return nil, err
		}
		payroll.GrossSalary = truncateToTwoDecimals(payroll.GrossSalary)
		payroll.NetSalary = truncateToTwoDecimals(payroll.NetSalary)
		payroll.EmployeeContribution = truncateToTwoDecimals(payroll.EmployeeContribution)
		payroll.EmployerContribution = truncateToTwoDecimals(payroll.EmployerContribution)
		payroll.TotalContribution = truncateToTwoDecimals(payroll.TotalContribution)
		payroll.Bonuses = truncateToTwoDecimals(payroll.Bonuses)
		payroll.Salary = truncateToTwoDecimals(payroll.Salary)

		payrollResults = append(payrollResults, payroll)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return payrollResults, nil
}

func (s *employeeService) AllEmployees(organizationId string) ([]domain.Employee, error) {
	fmt.Println(organizationId)

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

func (s *employeeService) EmployeeStatistics(organizationId string) (map[string]interface{}, error) {
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

func (s *employeeService) FilterEmployees(employeeName string, employeeStatus string, employeeJobType string, organizationId string) ([]domain.Employee, error) {
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

func (s *employeeService) UpdateEmployees(employee domain.Employee, organizationId string) ([]domain.Employee, error) {
	fmt.Println(employee)
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
	return s.AllEmployees(organizationId)
}

func (s *employeeService) DeleteEmployees(employeeIds []string, organizationId string) ([]domain.Employee, error) {
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

func (s *employeeService) GetOrganizations(organizationEmail string) ([]domain.Organizations, error) {
	rows, err := s.employeeRepository.Execute("SELECT organization_id, organization_name, organization_email FROM organizations WHERE organization_email = $1", organizationEmail)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var organizations []domain.Organizations

	for rows.Next() {
		var organization domain.Organizations
		err := rows.Scan(&organization.OrganizationID, &organization.OrganizationName, &organization.OrganizationEmail)
		if err != nil {
			return nil, err
		}
		organizations = append(organizations, organization)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return organizations, nil
}

func (s *employeeService) CreateOrganization(organizationEmail string, organizationName string) (domain.Organizations, error) {
	var existingOrg domain.Organizations
	rows, err := s.employeeRepository.Execute(`
		SELECT organization_id, organization_name, organization_email 
		FROM organizations 
		WHERE organization_name = $1`, organizationName)

	if err != nil {
		return domain.Organizations{}, fmt.Errorf("error checking organization existence: %w", err)
	}
	defer rows.Close()
	if rows.Next() {
		if err := rows.Scan(&existingOrg.OrganizationID, &existingOrg.OrganizationName, &existingOrg.OrganizationEmail); err != nil {
			return domain.Organizations{}, fmt.Errorf("error scanning existing organization: %w", err)
		}
		return existingOrg, nil
	}

	organizationID := helper.GenereateUUID()
	_, err = s.employeeRepository.Execute(`
		INSERT INTO organizations (organization_id, organization_name, organization_email) 
		VALUES ($1, $2, $3)`, organizationID, organizationName, organizationEmail)
	if err != nil {
		return domain.Organizations{}, fmt.Errorf("error inserting organization: %w", err)
	}

	return domain.Organizations{
		OrganizationID:    organizationID,
		OrganizationName:  organizationName,
		OrganizationEmail: organizationEmail,
	}, nil
}

func (s *employeeService) DeleteOrganization(organizationId string, organizationEmail string) (domain.Organizations, error) {
	rows, err := s.employeeRepository.Execute("DELETE FROM organizations WHERE organization_id = $1 RETURNING organization_id, organization_name, organization_email", organizationId)
	if err != nil {
		return domain.Organizations{}, err
	}

	_, err = s.employeeRepository.Execute("DELETE FROM employees WHERE organization_id = $1", organizationId)
	if err != nil {
		return domain.Organizations{}, err
	}
	defer rows.Close()

	var organization domain.Organizations
	if rows.Next() {
		err := rows.Scan(&organization.OrganizationID, &organization.OrganizationName, &organization.OrganizationEmail)
		if err != nil {
			return domain.Organizations{}, err
		}
	}

	if err = rows.Err(); err != nil {
		return domain.Organizations{}, err
	}

	orgRows, err := s.employeeRepository.Execute("SELECT organization_id, organization_name, organization_email FROM organizations WHERE organization_email = $1", organizationEmail)
	if err != nil {
		return domain.Organizations{}, err
	}
	defer orgRows.Close()

	var existingOrganization domain.Organizations
	if orgRows.Next() {
		err := orgRows.Scan(&existingOrganization.OrganizationID, &existingOrganization.OrganizationName, &existingOrganization.OrganizationEmail)
		if err != nil {
			return domain.Organizations{}, err
		}
	}
	return existingOrganization, nil
}
