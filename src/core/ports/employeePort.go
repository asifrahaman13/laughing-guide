package ports

import (
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
)

type EmployeeService interface {
	AllEmployees(organationId string, organizationEmail string) ([]domain.Employee, error)
	EmployeeStatistics(organizationId string, organizationEmail string) (map[string]interface{}, error)
	FilterEmployees(employeeName string, employeeStatus string, employeeRole string, organizationId string, organizationEmail string) ([]domain.Employee, error)
	UpdateEmployees(employee domain.Employee, organizationId string, organizationEmail string) ([]domain.Employee, error)
	DeleteEmployees(employeeIds []string, organizationId string, organizationEmail string) ([]domain.Employee, error)
}
