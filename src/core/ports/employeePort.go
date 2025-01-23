package ports

import (
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
)

type EmployeeService interface {
	ValidateOrganization(organizationId string, organizationEmail string) error
	CalculatePayroll(organizationId string, organizationEmail string) ([]domain.PayrollData, error)
	AllPayroll(organizationId string, organizationEmail string) ([]domain.EmployeePayrolls, error)
	AllEmployees(organationId string, organizationEmail string) ([]domain.Employee, error)
	EmployeeStatistics(organizationId string, organizationEmail string) (map[string]interface{}, error)
	FilterEmployees(employeeName string, employeeStatus string, employeeRole string, organizationId string, organizationEmail string) ([]domain.Employee, error)
	UpdateEmployees(employee domain.Employee, organizationId string, organizationEmail string) ([]domain.Employee, error)
	DeleteEmployees(employeeIds []string, organizationId string, organizationEmail string) ([]domain.Employee, error)
	GetSingleOrganization(organizationEmail string) (domain.Organizations, error)
	GetOrganizations(organizationEmail string) ([]domain.Organizations, error)
	CreateOrganization(organizationEmail string, organizationName string) (domain.Organizations, error)
	DeleteOrganization(organizationId string, organizationEmail string) (domain.Organizations, error)
}
