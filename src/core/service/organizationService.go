package service

import (
	"fmt"

	"github.com/asifrahaman13/laughing-guide/src/core/domain"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/asifrahaman13/laughing-guide/src/helper"
	"github.com/asifrahaman13/laughing-guide/src/repository"
)

type organizationService struct {
	organizationRepository repository.DatabaseRepository
	kafkaRepository        repository.KafkaRepository
}

func NewOrganizationService(organizationRepository repository.DatabaseRepository, kafkaRepository repository.KafkaRepository) ports.OrganizationService {
	return &organizationService{organizationRepository, kafkaRepository}
}

func (s *organizationService) ValidateOrganization(organizationId string, organizationEmail string) error {
	var count int
	err := s.organizationRepository.QueryRow(`
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

func (s *organizationService) GetSingleOrganization(organizationEmail string) (domain.Organizations, error) {

	rows, err := s.organizationRepository.Execute("SELECT organization_id, organization_name, organization_email FROM organizations WHERE organization_email = $1", organizationEmail)
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

func (s *organizationService) AllPayroll(organizationId string, organizationEmail string) ([]domain.EmployeePayrolls, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return nil, err
	}
	rows, err := s.organizationRepository.Execute(`
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

func (s *organizationService) NotifyPayroll(organizationId string, organizationEmail string) error {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return err
	}

	rows, err := s.organizationRepository.Execute(`
		SELECT
			e.employee_email,
			p.gross_salary,
			p.net_salary,
			p.employee_contribution,
			p.employer_contribution,
			p.total_contribution,
			p.bonuses,
			e.employee_name
		FROM payroll_data p
		JOIN employees e ON p.employee_id = e.employee_id
		AND e.organization_id = $1
	`, organizationId)
	if err != nil {
		return err
	}
	defer rows.Close()

	var payrollResults []domain.EmployeePayrolls
	truncateToTwoDecimals := helper.TruncateToTwoDecimals

	for rows.Next() {
		var payroll domain.EmployeePayrolls

		err := rows.Scan(&payroll.EmployeeEmail, &payroll.GrossSalary, &payroll.NetSalary, &payroll.EmployeeContribution, &payroll.EmployerContribution, &payroll.TotalContribution, &payroll.Bonuses, &payroll.EmployeeName)
		if err != nil {
			return err
		}
		payroll.GrossSalary = truncateToTwoDecimals(payroll.GrossSalary)
		payroll.NetSalary = truncateToTwoDecimals(payroll.NetSalary)
		payroll.EmployeeContribution = truncateToTwoDecimals(payroll.EmployeeContribution)
		payroll.EmployerContribution = truncateToTwoDecimals(payroll.EmployerContribution)
		payroll.TotalContribution = truncateToTwoDecimals(payroll.TotalContribution)
		payroll.Bonuses = truncateToTwoDecimals(payroll.Bonuses)

		payrollResults = append(payrollResults, payroll)
	}
	if err = rows.Err(); err != nil {
		return err
	}

	fmt.Println(payrollResults)

	for _, payroll := range payrollResults {
		fmt.Println("Sending email to: ", payroll.EmployeeEmail)
		fmt.Println("Email content: ", payroll)
		s.kafkaRepository.ProduceMessage(
			"payroll",
			fmt.Sprintf("Hello %s, your net salary is %f", payroll.EmployeeName, payroll.NetSalary),
		)
	}

	return nil
}

func (s *organizationService) CalculatePayroll(organizationId string, organizationEmail string) ([]domain.PayrollData, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return nil, err
	}

	rows, err := s.organizationRepository.Execute("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees WHERE organization_id = $1", organizationId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []domain.PayrollData
	tx, err := s.organizationRepository.BeginTransaction()
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

	batchSize := maxParameters / 7
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
			insertQuery = insertQuery[:len(insertQuery)-2]
			if _, err = tx.Exec(insertQuery+" ON CONFLICT (employee_id) DO UPDATE SET gross_salary = EXCLUDED.gross_salary, net_salary = EXCLUDED.net_salary, employee_contribution = EXCLUDED.employee_contribution, employer_contribution = EXCLUDED.employer_contribution, total_contribution = EXCLUDED.total_contribution, bonuses = EXCLUDED.bonuses", insertValues...); err != nil {
				return nil, err
			}

			insertQuery = `
            INSERT INTO payroll_data
            (employee_id, gross_salary, net_salary, employee_contribution, employer_contribution, total_contribution, bonuses)
            VALUES `
			insertValues = nil
			batchCount = 0
		}
	}

	if batchCount > 0 {
		insertQuery = insertQuery[:len(insertQuery)-2]
		if _, err = tx.Exec(insertQuery+" ON CONFLICT (employee_id) DO UPDATE SET gross_salary = EXCLUDED.gross_salary, net_salary = EXCLUDED.net_salary, employee_contribution = EXCLUDED.employee_contribution, employer_contribution = EXCLUDED.employer_contribution, total_contribution = EXCLUDED.total_contribution, bonuses = EXCLUDED.bonuses", insertValues...); err != nil {
			return nil, err
		}
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return results, nil
}

func (s *organizationService) GetOrganizations(organizationEmail string) ([]domain.Organizations, error) {
	rows, err := s.organizationRepository.Execute("SELECT organization_id, organization_name, organization_email FROM organizations WHERE organization_email = $1", organizationEmail)
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

func (s *organizationService) CreateOrganization(organizationEmail string, organizationName string) (domain.Organizations, error) {
	var existingOrg domain.Organizations
	rows, err := s.organizationRepository.Execute(`
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
	_, err = s.organizationRepository.Execute(`
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

func (s *organizationService) DeleteOrganization(organizationId string, organizationEmail string) (domain.Organizations, error) {
	if err := s.ValidateOrganization(organizationId, organizationEmail); err != nil {
		return domain.Organizations{}, err
	}
	rows, err := s.organizationRepository.Execute("DELETE FROM organizations WHERE organization_id = $1 RETURNING organization_id, organization_name, organization_email", organizationId)
	if err != nil {
		return domain.Organizations{}, err
	}

	_, err = s.organizationRepository.Execute("DELETE FROM employees WHERE organization_id = $1", organizationId)
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

	orgRows, err := s.organizationRepository.Execute("SELECT organization_id, organization_name, organization_email FROM organizations WHERE organization_email = $1", organizationEmail)
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
