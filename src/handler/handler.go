package handler

import (
	"encoding/csv"
	"net/http"
	"strconv"

	"github.com/asifrahaman13/laughing-guide/src/database"
	"github.com/asifrahaman13/laughing-guide/src/domain"
	"github.com/asifrahaman13/laughing-guide/src/helper"
	"github.com/asifrahaman13/laughing-guide/src/service"
	"github.com/gin-gonic/gin"
)

func UploadHandler(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not open file"})
		return
	}
	defer src.Close()

	reader := csv.NewReader(src)
	records, err := reader.ReadAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not read CSV file"})
		return
	}

	var values []interface{}
	query := `INSERT INTO employees (employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses) VALUES `
	for i, row := range records {
		if i == 0 {
			continue
		}
		salary, _ := strconv.ParseFloat(row[6], 64)
		age, _ := strconv.Atoi(row[9])
		bonuses, _ := strconv.ParseFloat(row[10], 64)
		query += `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),`
		values = append(values, row[0], row[1], row[2], row[3], row[4], row[5], salary, row[7], row[8], age, bonuses)
	}
	query = query[:len(query)-1]

	_, err = database.Database.Exec(query, values...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save employee data to database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employees uploaded successfully"})
}

func CalculatePayrollHandler(c *gin.Context) {
	rows, err := database.Database.Query("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve employee data"})
		return
	}
	defer rows.Close()

	var results []gin.H
	tx, err := database.Database.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
		return
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	var insertValues []interface{}
	insertQuery := `
        INSERT INTO payroll_data 
        (employee_id, gross_salary, net_salary, employee_contribution, employer_contribution, total_contribution, bonuses) 
        VALUES `

	for rows.Next() {
		var employee domain.Employee
		var salary float64
		var age int
		var bonuses float64

		err := rows.Scan(&employee.EmployeeID, &employee.EmployeeProfile, &employee.EmployeeEmail, &employee.EmployeeName, &employee.EmployeeRole, &employee.EmployeeStatus, &salary, &employee.EmployeeJobType, &employee.EmployeeResident, &age, &bonuses)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not scan employee data"})
			return
		}

		isCitizen := employee.EmployeeResident == "Citizen"
		cpf := service.CalculateCPF(age, salary, isCitizen)

		grossSalary := salary + bonuses
		netSalary := grossSalary - cpf.TotalContribution

		result := gin.H{
			"employeeId":       employee.EmployeeID,
			"employeeName":     employee.EmployeeName,
			"employeeSalary":   salary,
			"bonuses":          bonuses,
			"cpfContributions": cpf,
			"grossSalary":      grossSalary,
			"netSalary":        netSalary,
		}

		results = append(results, result)

		insertQuery += "(?, ?, ?, ?, ?, ?, ?), "
		insertValues = append(insertValues, employee.EmployeeID, grossSalary, netSalary, cpf.EmployeeContribution, cpf.EmployerContribution, cpf.TotalContribution, bonuses)
	}

	insertQuery = insertQuery[:len(insertQuery)-2]
	_, err = tx.Exec(insertQuery+" ON CONFLICT (employee_id) DO UPDATE SET gross_salary = EXCLUDED.gross_salary, net_salary = EXCLUDED.net_salary, employee_contribution = EXCLUDED.employee_contribution, employer_contribution = EXCLUDED.employer_contribution, total_contribution = EXCLUDED.total_contribution, bonuses = EXCLUDED.bonuses", insertValues...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save payroll data"})
		return
	}

	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over employee data"})
		return
	}
	c.JSON(http.StatusOK, results)
}

func FetchPayrollHandler(c *gin.Context) {
	rows, err := database.Database.Query(`
        SELECT 
            p.employee_id, 
            p.gross_salary, 
            p.net_salary, 
            p.employee_contribution, 
            p.employer_contribution, 
            p.total_contribution, 
            p.bonuses, 
            e.employee_salary,
            e.employee_email,
            e.employee_name
        FROM payroll_data p
        JOIN employees e ON p.employee_id = e.employee_id`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve payroll data", "details": err.Error()})
		return
	}
	defer rows.Close()

	var payrollResults []gin.H

	truncateToTwoDecimals := helper.TruncateToTwoDecimals

	for rows.Next() {
		var employeeID string
		var grossSalary, netSalary, employeeContribution, employerContribution, totalContribution, bonuses, salary float64
		var email, name string

		err := rows.Scan(&employeeID, &grossSalary, &netSalary, &employeeContribution, &employerContribution, &totalContribution, &bonuses, &salary, &email, &name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not scan payroll data", "details": err.Error()})
			return
		}
		grossSalary = truncateToTwoDecimals(grossSalary)
		netSalary = truncateToTwoDecimals(netSalary)
		employeeContribution = truncateToTwoDecimals(employeeContribution)
		employerContribution = truncateToTwoDecimals(employerContribution)
		totalContribution = truncateToTwoDecimals(totalContribution)
		bonuses = truncateToTwoDecimals(bonuses)
		salary = truncateToTwoDecimals(salary)

		payroll := gin.H{
			"employeeId":           employeeID,
			"grossSalary":          grossSalary,
			"netSalary":            netSalary,
			"employeeContribution": employeeContribution,
			"employerContribution": employerContribution,
			"totalContribution":    totalContribution,
			"bonuses":              bonuses,
			"salary":               salary,
			"employeeEmail":        email,
			"employeeName":         name,
		}

		payrollResults = append(payrollResults, payroll)
	}
	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during row iteration", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payrollResults)
}

func GetEmployeesHandler(c *gin.Context) {
	rows, err := database.Database.Query("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve employee data"})
		return
	}
	defer rows.Close()

	var employees []domain.Employee

	for rows.Next() {
		var employee domain.Employee
		err := rows.Scan(&employee.EmployeeID, &employee.EmployeeProfile, &employee.EmployeeEmail, &employee.EmployeeName, &employee.EmployeeRole, &employee.EmployeeStatus, &employee.EmployeeSalary, &employee.EmployeeJobType, &employee.EmployeeResident, &employee.EmployeeAge, &employee.Bonuses)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not scan employee data"})
			return
		}
		employees = append(employees, employee)
	}

	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over employee data"})
		return
	}

	c.JSON(http.StatusOK, employees)
}

func GetEmployeeStatisticsHandler(c *gin.Context) {
	rows, err := database.Database.Query("SELECT employee_resident, employee_job_type, employee_status FROM employees")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve employee data"})
		return
	}
	defer rows.Close()

	nationalityCount := map[string]int{
		"Singaporean": 0,
		"PR":          0,
		"Foreigner":   0,
		"Others":      0,
	}
	employmentTypeCount := map[string]int{
		"FullTime": 0,
		"PartTime": 0,
		"Intern":   0,
		"Contract": 0,
	}
	employeeStatusCount := map[string]int{
		"Active":       0,
		"Invite Sent":  0,
		"Payroll Only": 0,
	}

	for rows.Next() {
		var resident, jobType, status string
		err := rows.Scan(&resident, &jobType, &status)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not scan employee data"})
			return
		}

		switch resident {
		case "Citizen":
			nationalityCount["Singaporean"]++
		case "PR":
			nationalityCount["PR"]++
		case "Foreigner":
			nationalityCount["Foreigner"]++
		default:
			nationalityCount["Others"]++
		}

		switch jobType {
		case "Full-time":
			employmentTypeCount["FullTime"]++
		case "Part-time":
			employmentTypeCount["PartTime"]++
		case "Intern":
			employmentTypeCount["Intern"]++
		case "Contract":
			employmentTypeCount["Contract"]++
		}

		switch status {
		case "Active":
			employeeStatusCount["Active"]++
		case "Invite Sent":
			employeeStatusCount["Invite Sent"]++
		case "Payroll Only":
			employeeStatusCount["Payroll Only"]++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"Nationality":    nationalityCount,
		"EmploymentType": employmentTypeCount,
		"EmployeeStatus": employeeStatusCount,
	})
}
