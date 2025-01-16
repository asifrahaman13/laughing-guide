package handler

import (
	"fmt"
	"net/http"

	"github.com/asifrahaman13/laughing-guide/src/core/service"
	"github.com/gin-gonic/gin"
)

type EmployeeHandler struct {
	service service.EmployeeService
}

func NewEmployeeHandler(service service.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{service}
}

func (h *EmployeeHandler) CalculatePayrollHandler(c *gin.Context) {
	result, err := h.service.CalculatePayroll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FetchPayrollHandler(c *gin.Context) {
	result, err := h.service.AllPayroll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetEmployeesHandler(c *gin.Context) {
	result, err := h.service.AllEmployees()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetEmployeeStatisticsHandler(c *gin.Context) {
	result, err := h.service.EmployeeStatistics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FilterEmployees(c *gin.Context) {
	employeeName := c.Query("employee_name")
	employeeStatus := c.Query("employee_status")
	employeeRole := c.Query("employee_role")
	fmt.Println(employeeName, employeeStatus, employeeRole)
	result, err := h.service.FilterEmployees(employeeName, employeeStatus, employeeRole)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FetchPayrollHandlerc(c *gin.Context) {
	result, err := h.service.AllPayroll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return

	}
	c.JSON(http.StatusOK, result)
}
