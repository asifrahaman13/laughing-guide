package routers

import (
	"github.com/asifrahaman13/laughing-guide/src/handler"
	"github.com/gin-gonic/gin"
)

func InitRoutes(employeeHandler *handler.EmployeeHandler, fileHandler *handler.FileHandler, r *gin.Engine) {
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "ok",
        })
    })

    r.POST("/upload", fileHandler.UploadHandler)
    r.GET("/sample-csv", fileHandler.GetSampleCSVHandler)

    r.GET("/calculate-payroll", employeeHandler.CalculatePayrollHandler)
    r.GET("/payroll", employeeHandler.FetchPayrollHandler)
    r.GET("/employees", employeeHandler.GetEmployeesHandler)
    r.GET("/aggregate", employeeHandler.GetEmployeeStatisticsHandler)
    r.GET("/filter-employees", employeeHandler.FilterEmployees)
    r.POST("/delete-employees", employeeHandler.DeleteEmployeeHandler)

    r.GET("/api/auth/google", employeeHandler.GoogleAuthHandler)
    r.GET("/api/auth/login", employeeHandler.ValidateTokenHandler)

    r.GET("/organizations", employeeHandler.GetOrganizationsHandler)
    r.POST("/add-organization", employeeHandler.AddOrganizationHandler)
	r.POST("/delete-organization", employeeHandler.DeleteOrganizationHandler)
}
