package ports

import "github.com/asifrahaman13/laughing-guide/src/core/domain"

type OrganizationService interface {
	ValidateOrganization(organizationId string, organizationEmail string) error
	CalculatePayroll(organizationId string, organizationEmail string) ([]domain.PayrollData, error)
	AllPayroll(organizationId string, organizatiionEmail string) ([]domain.EmployeePayrolls, error)
	GetOrganizations(organizationEmail string) ([]domain.Organizations, error)
	CreateOrganization(organizationEmail string, organizationName string) (domain.Organizations, error)
	DeleteOrganization(organizationId string, organizationEmail string) (domain.Organizations, error)
	GetSingleOrganization(organizationEmail string) (domain.Organizations, error)
}
