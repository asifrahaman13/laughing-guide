package ports

import (
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
)

type EmployeeService interface {
	CalculatePayroll(organizationId string) ([]domain.PayrollData, error)
	AllPayroll(organizationId string) ([]domain.EmployeePayrolls, error)
	AllEmployees(organationId string) ([]domain.Employee, error)
	EmployeeStatistics(organizationId string) (map[string]interface{}, error)
	FilterEmployees(employeeName string, employeeStatus string, employeeRole string, organizationId string) ([]domain.Employee, error)
	DeleteEmployees(employeeIds []string, organizationId string) ([]domain.Employee, error)
	GetSingleOrganization(organizationEmail string) (domain.Organizations, error)
	GetOrganizations(organizationEmail string) ([]domain.Organizations, error)
	CreateOrganization(organizationEmail string, organizationName string) (domain.Organizations, error)
	DeleteOrganization(organizationId string, organizationEmail string) (domain.Organizations, error)
}
