package routers

import (
	"github.com/asifrahaman13/laughing-guide/src/handler"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitRoutes() *gin.Engine {
	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "ok",
		})
	})

	r.POST("/upload", handler.UploadHandler)
	r.GET("/calculate-payroll", handler.CalculatePayrollHandler)
	r.GET("/payroll", handler.FetchPayrollHandler)
	r.GET("/employees", handler.GetEmployeesHandler)
	r.GET("/aggregate", handler.GetEmployeeStatisticsHandler)
	r.GET("/sample-csv", handler.GetSampleCSVHandler)

	return r
}