package ports

import (
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
)

type EmployeeService interface {
	CalculatePayroll() (any, error)
	AllPayroll() (any, error)
	AllEmployees() (any, error)
	EmployeeStatistics() (any, error)
	FilterEmployees(employeeName string, employeeStatus string, employeeRole string) (any, error)
	DeleteEmployees(employeeIds []string) ([]domain.Employee, error)
}
