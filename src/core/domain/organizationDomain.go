package domain

type OrganizationRequest struct {
	OrganizationID    string `json:"organizationId"`
	OrganizationName  string `json:"organizationName"`
	OrganizationEmail string `json:"organizationEmail"`
}

type Organizations struct {
	OrganizationID    string `json:"organizationId"`
	OrganizationName  string `json:"organizationName"`
	OrganizationEmail string `json:"organizationEmail"`
}
