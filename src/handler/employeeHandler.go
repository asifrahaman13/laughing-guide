package handler

import (
	"fmt"
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/gin-gonic/gin"
	"net/http"
)

type EmployeeHandler struct {
	service ports.EmployeeService
}

func NewEmployeeHandler(service ports.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{service}
}

func (h *EmployeeHandler) GetEmployeesHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	result, err := h.service.AllEmployees(organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetEmployeeStatisticsHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	result, err := h.service.EmployeeStatistics(organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FilterEmployees(c *gin.Context) {
	organizationId := c.Query("organizationId")
	employeeName := c.Query("employee_name")
	employeeStatus := c.Query("employee_status")
	employeeRole := c.Query("employee_role")
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	fmt.Println(employeeName, employeeStatus, employeeRole)
	result, err := h.service.FilterEmployees(employeeName, employeeStatus, employeeRole, organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) UpdateEmployeeHandler(c *gin.Context) {
	var request domain.Employee
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	result, err := h.service.UpdateEmployees(request, request.OrganizationID, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) DeleteEmployeeHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	var request domain.EmployeeRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	result, err := h.service.DeleteEmployees(request.EmployeeIds, organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
