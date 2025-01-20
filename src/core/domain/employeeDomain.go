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

type Organizations struct {
	OrganizationID    string `json:"organizationId"`
	OrganizationName  string `json:"organizationName"`
	OrganizationEmail string `json:"organizationEmail"`
}

type PayrollData struct {
	EmployeeID       string
	EmployeeName     string
	EmployeeSalary   float64
	Bonuses          float64
	CPFContributions CPFContribution
	GrossSalary      float64
	NetSalary        float64
}

type EmployeePayrolls struct {
	EmployeeID           string  `json:"employeeId"`
	GrossSalary          float64 `json:"grossSalary"`
	NetSalary            float64 `json:"netSalary"`
	EmployeeContribution float64 `json:"employeeContribution"`
	EmployerContribution float64 `json:"employerContribution"`
	TotalContribution    float64 `json:"totalContribution"`
	Bonuses              float64 `json:"bonuses"`
	Salary               float64 `json:"salary"`
	EmployeeEmail        string  `json:"employeeEmail"`
	EmployeeName         string  `json:"employeeName"`
}
