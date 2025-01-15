package handler

import (
	"encoding/csv"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/asifrahaman13/laughing-guide/src/database"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
)

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

	var values []interface{}
	query := `INSERT INTO employees (employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses) VALUES `
	var placeholders []string
	for i, row := range records {
		if i == 0 {
			continue
		}
		salary, _ := strconv.ParseFloat(row[6], 64)
		age, _ := strconv.Atoi(row[9])
		bonuses, _ := strconv.ParseFloat(row[10], 64)
		placeholder := `($` + strconv.Itoa(len(values)+1) + `, $` + strconv.Itoa(len(values)+2) + `, $` + strconv.Itoa(len(values)+3) + `, $` + strconv.Itoa(len(values)+4) + `, $` + strconv.Itoa(len(values)+5) + `, $` + strconv.Itoa(len(values)+6) + `, $` + strconv.Itoa(len(values)+7) + `, $` + strconv.Itoa(len(values)+8) + `, $` + strconv.Itoa(len(values)+9) + `, $` + strconv.Itoa(len(values)+10) + `, $` + strconv.Itoa(len(values)+11) + `)`
		placeholders = append(placeholders, placeholder)
		values = append(values, row[0], row[1], row[2], row[3], row[4], row[5], salary, row[7], row[8], age, bonuses)
	}
	query += strings.Join(placeholders, ", ")
	_, err = database.Database.Exec(query, values...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save employee data to database", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Employees uploaded successfully"})
}

func GetSampleCSVHandler(c *gin.Context) {

	key := "sample.csv"
	bucket := os.Getenv("AWS_BUCKET_NAME")
	region := os.Getenv("AWS_REGION")

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create AWS session",
		})
		return
	}

	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})

	presignedURL, err := req.Presign(5 * time.Minute)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate presigned URL",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"presigned_url": presignedURL,
	})
}