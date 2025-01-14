package handler

import (
	"encoding/csv"
	"net/http"
	"strconv"

	"github.com/asifrahaman13/laughing-guide/src/database"
	"github.com/asifrahaman13/laughing-guide/src/service"
	"github.com/gin-gonic/gin"
)

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

	for rows.Next() {
		var employee Employee
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

		result := gin.H{
			"employeeId":       employee.EmployeeID,
			"employeeName":     employee.EmployeeName,
			"employeeSalary":   salary,
			"bonuses":          bonuses,
			"cpfContributions": cpf,
			"grossSalary":      salary + bonuses,
			"netSalary":        salary + bonuses - cpf.TotalContribution,
		}

		results = append(results, result)
	}

	c.JSON(http.StatusOK, results)
}

func GetEmployeesHandler(c *gin.Context) {
	rows, err := database.Database.Query("SELECT employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses FROM employees")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve employee data"})
		return
	}
	defer rows.Close()

	var employees []Employee

	for rows.Next() {
		var employee Employee
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
