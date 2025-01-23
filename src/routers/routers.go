package routers

import (
	"github.com/asifrahaman13/laughing-guide/src/handler"
	"github.com/asifrahaman13/laughing-guide/src/middleware"
	"github.com/gin-gonic/gin"
)

func setUpEmployeeRoutes(employeeHandler *handler.EmployeeHandler, r *gin.Engine, middlewares ...gin.HandlerFunc) {

	employees := r.Group("/employees")

	for _, middleware := range middlewares {
		employees.Use(middleware)
	}

	employees.GET("/employees", employeeHandler.GetEmployeesHandler)
	employees.GET("/aggregate", employeeHandler.GetEmployeeStatisticsHandler)
	employees.GET("/filter-employees", employeeHandler.FilterEmployees)
	employees.POST("/update-employees", employeeHandler.UpdateEmployeeHandler)
	employees.POST("/delete-employees", employeeHandler.DeleteEmployeeHandler)
}

func setUpFileRoutes(fileHandler *handler.FileHandler, r *gin.Engine, middlewares ...gin.HandlerFunc) {
	files := r.Group("/files")

	for _, middleware := range middlewares {
		files.Use(middleware)
	}
	files.POST("/upload", fileHandler.UploadHandler)
	files.POST("/process-file", fileHandler.ProcessfileHandler)
	files.GET("/csv-file", fileHandler.GetSampleCSVHandler)
}

func setUpAuthRoutes(organizationHandler *handler.OrganizationHandler, r *gin.Engine) {
	r.GET("/api/auth/google", organizationHandler.GoogleAuthHandler)
	r.GET("/api/auth/login", organizationHandler.ValidateTokenHandler)
	r.GET("/one-org", organizationHandler.GetSingleOrganizationHandler)
}

func setUpOrganizationRoutes(organizationHandler *handler.OrganizationHandler, r *gin.Engine, middlewares ...gin.HandlerFunc) {
	organizations := r.Group("/organizations")
	for _, middleware := range middlewares {
		organizations.Use(middleware)
	}
	organizations.GET("/organizations", organizationHandler.GetOrganizationsHandler)
	organizations.POST("/add-organization", organizationHandler.AddOrganizationHandler)
	organizations.POST("/delete-organization", organizationHandler.DeleteOrganizationHandler)
	organizations.GET("/calculate-payroll", organizationHandler.CalculatePayrollHandler)
	organizations.GET("/payroll", organizationHandler.FetchPayrollHandler)
}

func InitRoutes(employeeHandler *handler.EmployeeHandler, fileHandler *handler.FileHandler, organizationHandler *handler.OrganizationHandler, r *gin.Engine) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "ok",
		})
	})

	setUpEmployeeRoutes(employeeHandler, r, middleware.AuthMiddleware())
	setUpFileRoutes(fileHandler, r, middleware.AuthMiddleware())
	setUpAuthRoutes(organizationHandler, r)
	setUpOrganizationRoutes(organizationHandler, r, middleware.AuthMiddleware())
}
