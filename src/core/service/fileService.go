package service

import (
	"encoding/csv"
	"mime/multipart"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/asifrahaman13/laughing-guide/src/repository"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type FileService interface {
	UploadCSVFile(file *multipart.FileHeader) (any, error)
	GetSampleFile() (any, error)
}

type fileService struct {
	employeeRepository repository.EmployeeRepository
}

func NewFileService(employeeRepository repository.EmployeeRepository) FileService {
	return &fileService{employeeRepository}
}

func (s *fileService) UploadCSVFile(file *multipart.FileHeader) (any, error) {
	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	reader := csv.NewReader(src)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
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
	_, err = s.employeeRepository.Execute(query, values...)
	if err != nil {
		return nil, err
	}
	return true, nil
}

func (s *fileService) GetSampleFile() (any, error) {
	key := "sample.csv"
	bucket := os.Getenv("AWS_BUCKET_NAME")
	region := os.Getenv("AWS_REGION")

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
	})
	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})

	presignedURL, err := req.Presign(5 * time.Minute)
	if err != nil {
		return nil, err
	}

	prepresigned_url := make(map[string]string)
	prepresigned_url["presigned_url"] = presignedURL
	return prepresigned_url, nil
}
