package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/asifrahaman13/laughing-guide/src/database"
	"github.com/asifrahaman13/laughing-guide/src/handler"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Employee struct {
	EmployeeID       string `json:"employeeId"`
	EmployeeProfile  string `json:"employeeProfile"`
	EmployeeEmail    string `json:"employeeEmail"`
	EmployeeName     string `json:"employeeName"`
	EmployeeRole     string `json:"employeeRole"`
	EmployeeStatus   string `json:"employeeStatus"`
	EmployeeSalary   string `json:"employeeSalary"`
	EmployeeJobType  string `json:"employeeJobType"`
	EmployeeResident string `json:"employeeResident"`
}

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default environment variables")
	}
	mode := os.Getenv("GIN_MODE")
	fmt.Println("Mode: ", mode)
	if mode == "" {
		mode = "debug"
	}

	if mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	database.InitDB()

	r := gin.Default()
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "ok",
		})
	})

	r.POST("/upload", handler.UploadHandler)
	r.GET("/calculate-payroll", handler.CalculatePayrollHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	go func() {
		log.Println("Server started on :" + port)
		if err := srv.ListenAndServe(); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c
	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server exiting")
}
