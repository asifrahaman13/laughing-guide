package ports

import (
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
)

type EmployeeService interface {
	CalculatePayroll(organizationId string) (any, error)
	AllPayroll(organizationId string) (any, error)
	AllEmployees(organationId string) (any, error)
	EmployeeStatistics(organizationId string) (any, error)
	FilterEmployees(employeeName string, employeeStatus string, employeeRole string, organizationId string) (any, error)
	DeleteEmployees(employeeIds []string, organizationId string) ([]domain.Employee, error)
	GetSingleOrganization(organizationEmail string) (domain.Organizations, error)
	GetOrganizations(organizationEmail string) ([]domain.Organizations, error)
	CreateOrganization(organizationEmail string, organizationName string) (domain.Organizations, error)
	DeleteOrganization(organizationId string, organizationEmail string) (domain.Organizations, error)
}
