package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/asifrahaman13/laughing-guide/src/config"
	"github.com/asifrahaman13/laughing-guide/src/core/service"
	"github.com/asifrahaman13/laughing-guide/src/database"
	"github.com/asifrahaman13/laughing-guide/src/handler"
	"github.com/asifrahaman13/laughing-guide/src/repository"
	"github.com/asifrahaman13/laughing-guide/src/routers"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	database.InitDB()

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	if cfg.GinMode == "" {
		cfg.GinMode = "debug"
	}

	if cfg.GinMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	databaseURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s", cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBSSLMode)

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	employeeRepo := repository.NewDatabaseRepository(db)
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(cfg.AwsRegion),
	}))
	s3Client := s3.New(sess)
	awsRepo := repository.NewAwsRepository(s3Client)
	employeeService := service.NewEmployeeService(employeeRepo)
	employeeHandler := handler.NewEmployeeHandler(employeeService)

	fileService := service.NewFileService(employeeRepo, awsRepo)
	fileHandler := handler.NewFileHandler(fileService)

	r := gin.Default()

	
	r.Use(cors.Default())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "ok",
		})
	})

	r = routers.InitRoutes(employeeHandler, fileHandler)
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	go func() {
		log.Println("Server started on :" + cfg.Port)
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
