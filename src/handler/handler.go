package handler

import (
	"fmt"
	"net/http"

	"github.com/asifrahaman13/laughing-guide/src/core/domain"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/gin-gonic/gin"
)

type EmployeeHandler struct {
	service ports.EmployeeService
}

func NewEmployeeHandler(service ports.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{service}
}

func (h *EmployeeHandler) CalculatePayrollHandler(c *gin.Context) {
	organizationId:=c.Query("organizationId")
	result, err := h.service.CalculatePayroll(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FetchPayrollHandler(c *gin.Context) {
	organizationId:=c.Query("organizationId")
	result, err := h.service.AllPayroll(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetEmployeesHandler(c *gin.Context) {
	organizationId:=c.Query("organizationId")
	result, err := h.service.AllEmployees(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetEmployeeStatisticsHandler(c *gin.Context) {
	organizationId:=c.Query("organizationId")
	result, err := h.service.EmployeeStatistics(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FilterEmployees(c *gin.Context) {
	organizationId:=c.Query("organizationId")
	employeeName := c.Query("employee_name")
	employeeStatus := c.Query("employee_status")
	employeeRole := c.Query("employee_role")
	fmt.Println(employeeName, employeeStatus, employeeRole)
	result, err := h.service.FilterEmployees(employeeName, employeeStatus, employeeRole, organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FetchPayrollHandlerc(c *gin.Context) {
	organizationId:=c.Query("organizationId")
	result, err := h.service.AllPayroll(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return

	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) DeleteEmployeeHandler(c *gin.Context) {
	organizationId:=c.Query("organizationId")
	var request domain.EmployeeRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.DeleteEmployees(request.EmployeeIds , organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
