package handler

import (
	"encoding/csv"
	"net/http"
	"strconv"

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

	var employees []Employee
	for i, row := range records {
		if i == 0 {
			continue
		}

		salary, _ := strconv.ParseFloat(row[6], 64)
		age, _ := strconv.Atoi(row[9])
		bonuses, _ := strconv.ParseFloat(row[10], 64)

		employees = append(employees, Employee{
			EmployeeID:       row[0],
			EmployeeProfile:  row[1],
			EmployeeEmail:    row[2],
			EmployeeName:     row[3],
			EmployeeRole:     row[4],
			EmployeeStatus:   row[5],
			EmployeeSalary:   salary,
			EmployeeJobType:  row[7],
			EmployeeResident: row[8],
			EmployeeAge:      age,
			Bonuses:          bonuses,
		})
	}
	c.JSON(http.StatusOK, employees)
}
