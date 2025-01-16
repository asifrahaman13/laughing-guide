package helper

import (
	"math"

	"github.com/asifrahaman13/laughing-guide/src/core/domain"
)

func TruncateToTwoDecimals(value float64) float64 {
	return math.Trunc(value*100) / 100
}

func CalculateCPF(age int, salary float64, isCitizen bool) domain.CPFContribution {
	var employeeRate, employerRate float64
	switch {
	case age < 55:
		employeeRate, employerRate = 0.11, 0.17
	case age <= 60:
		employeeRate, employerRate = 0.09, 0.13
	case age <= 65:
		employeeRate, employerRate = 0.075, 0.095
	default:
		employeeRate, employerRate = 0.05, 0.075
	}

	if !isCitizen {
		employeeRate = 0.0
		employerRate = 0.0
	}

	employeeContribution := salary * employeeRate
	employerContribution := salary * employerRate
	totalContribution := employeeContribution + employerContribution

	return domain.CPFContribution{
		EmployeeContribution: employeeContribution,
		EmployerContribution: employerContribution,
		TotalContribution:    totalContribution,
	}
}
