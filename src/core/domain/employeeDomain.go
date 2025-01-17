package domain

type Employee struct {
	OrganizationID   string  `json:"organizationId"`
	EmployeeID       string  `json:"employeeId"`
	EmployeeProfile  string  `json:"employeeProfile"`
	EmployeeEmail    string  `json:"employeeEmail"`
	EmployeeName     string  `json:"employeeName"`
	EmployeeRole     string  `json:"employeeRole"`
	EmployeeStatus   string  `json:"employeeStatus"`
	EmployeeSalary   float64 `json:"employeeSalary"`
	EmployeeJobType  string  `json:"employeeJobType"`
	EmployeeResident string  `json:"employeeResident"`
	EmployeeAge      int     `json:"employeeAge"`
	Bonuses          float64 `json:"bonuses"`
}

type EmployeeRequest struct {
	EmployeeIds []string `json:"employeeIds"`
}

type CPFContribution struct {
	EmployeeContribution float64 `json:"employeeContribution"`
	EmployerContribution float64 `json:"employerContribution"`
	TotalContribution    float64 `json:"totalContribution"`
}

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
