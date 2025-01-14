package domain

type Employee struct {
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