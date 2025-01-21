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
	employees.GET("/calculate-payroll", employeeHandler.CalculatePayrollHandler)
	employees.GET("/payroll", employeeHandler.FetchPayrollHandler)
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

func setUpAuthRoutes(employeeHandler *handler.EmployeeHandler, r *gin.Engine) {
	r.GET("/api/auth/google", employeeHandler.GoogleAuthHandler)
	r.GET("/api/auth/login", employeeHandler.ValidateTokenHandler)
	r.GET("/one-org", employeeHandler.GetSingleOrganizationHandler)
}

func setUpOrganizationRoutes(employeeHandler *handler.EmployeeHandler, r *gin.Engine, middlewares ...gin.HandlerFunc) {
	organizations := r.Group("/organizations")
	for _, middleware := range middlewares {
		organizations.Use(middleware)
	}
	organizations.GET("/organizations", employeeHandler.GetOrganizationsHandler)
	organizations.POST("/add-organization", employeeHandler.AddOrganizationHandler)
	organizations.POST("/delete-organization", employeeHandler.DeleteOrganizationHandler)
}

func InitRoutes(employeeHandler *handler.EmployeeHandler, fileHandler *handler.FileHandler, r *gin.Engine) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "ok",
		})
	})

	setUpEmployeeRoutes(employeeHandler, r, middleware.AuthMiddleware())
	setUpFileRoutes(fileHandler, r, middleware.AuthMiddleware())
	setUpAuthRoutes(employeeHandler, r)
	setUpOrganizationRoutes(employeeHandler, r, middleware.AuthMiddleware())
}
