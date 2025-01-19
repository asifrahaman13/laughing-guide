package service

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/asifrahaman13/laughing-guide/src/repository"
	"io"
	"mime/multipart"
	"os"
	"strconv"
	"strings"
)

type fileService struct {
	employeeRepository repository.DatabaseRepository
	awsRepository      repository.AwsRepository
}

func NewFileService(employeeRepository repository.DatabaseRepository, awsRepository repository.AwsRepository) ports.FileService {
	return &fileService{employeeRepository, awsRepository}
}

func (s *fileService) UploadCSVFile(file *multipart.FileHeader, organizationId string) (bool, error) {
	src, err := file.Open()
	if err != nil {
		return false, err
	}
	defer src.Close()

	var buf bytes.Buffer
	tee := io.TeeReader(src, &buf)

	err = s.awsRepository.UploadFile(os.Getenv("AWS_BUCKET_NAME"), fmt.Sprintf("%s.csv", organizationId), tee)
	if err != nil {
		return false, err
	}

	reader := csv.NewReader(&buf)
	records, err := reader.ReadAll()
	if err != nil {
		return false, err
	}

	var values []interface{}
	query := `INSERT INTO employees (organization_id, employee_id, employee_profile, employee_email, employee_name, employee_role, employee_status, employee_salary, employee_job_type, employee_resident, employee_age, bonuses) VALUES `
	var placeholders []string

	for i, row := range records {
		if i == 0 {
			continue
		}

		salary, err := strconv.ParseFloat(row[6], 64)
		if err != nil {
			return false, fmt.Errorf("invalid salary value at row %d: %v", i+1, err)
		}
		age, err := strconv.Atoi(row[9])
		if err != nil {
			return false, fmt.Errorf("invalid age value at row %d: %v", i+1, err)
		}
		bonuses, err := strconv.ParseFloat(row[10], 64)
		if err != nil {
			return false, fmt.Errorf("invalid bonuses value at row %d: %v", i+1, err)
		}

		placeholder := fmt.Sprintf(
			"($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			len(values)+1, len(values)+2, len(values)+3, len(values)+4,
			len(values)+5, len(values)+6, len(values)+7, len(values)+8,
			len(values)+9, len(values)+10, len(values)+11, len(values)+12,
		)
		placeholders = append(placeholders, placeholder)
		values = append(values, organizationId, row[0], row[1], row[2], row[3], row[4],
			row[5], salary, row[7], row[8], age, bonuses)
	}

	query += strings.Join(placeholders, ", ")
	_, err = s.employeeRepository.Execute(query, values...)
	if err != nil {
		return false, err
	}

	return true, nil
}

func (s *fileService) GetSampleFile(key string) (any, error) {
	bucket := os.Getenv("AWS_BUCKET_NAME")
	presignedURL, err := s.awsRepository.DownloadFile(bucket, fmt.Sprintf("%s.csv", key))
	if err != nil {
		return nil, err
	}
	prepresigned_url := make(map[string]string)
	prepresigned_url["presigned_url"] = presignedURL
	return prepresigned_url, nil
}
