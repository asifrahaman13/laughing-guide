package service

type CPFContribution struct {
	EmployeeContribution float64 `json:"employeeContribution"`
	EmployerContribution  float64 `json:"employerContribution"`
	TotalContribution     float64 `json:"totalContribution"`
}

// Define CPF contribution rates based on age groups
func CalculateCPF(age int, salary float64, isCitizen bool) CPFContribution {
	var employeeRate, employerRate float64

	// Determine contribution rates based on age and citizenship
	switch {
	case age < 55:
		employeeRate, employerRate = 0.11, 0.17 // Example rates for < 55
	case age <= 60:
		employeeRate, employerRate = 0.09, 0.13 // Example rates for 55-60
	case age <= 65:
		employeeRate, employerRate = 0.075, 0.095 // Example rates for 60-65
	default:
		employeeRate, employerRate = 0.05, 0.075 // Example rates for > 65
	}

	if !isCitizen {
		// Adjust rates for non-citizens, if applicable
		employeeRate = 0.0 // Example: no employee contribution for non-citizens
		employerRate = 0.0 // Example: no employer contribution for non-citizens
	}

	// Calculate contributions
	employeeContribution := salary * employeeRate
	employerContribution := salary * employerRate
	totalContribution := employeeContribution + employerContribution

	return CPFContribution{
		EmployeeContribution: employeeContribution,
		EmployerContribution:  employerContribution,
		TotalContribution:     totalContribution,
	}
}
