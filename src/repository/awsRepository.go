package repository

import (
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type AwsRepository interface {
	DownloadFile(bucketName, fileName string) (string, error)
}

type awsRepository struct {
	s3Client *s3.S3
}

func NewAwsRepository(s3Client *s3.S3) AwsRepository {
	return &awsRepository{s3Client}
}

func (r *awsRepository) DownloadFile(bucketName, fileName string) (string, error) {
	region := os.Getenv("AWS_REGION")
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
	})
	if err != nil {
		return "", err
	}
	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
	})
	presignedURL, err := req.Presign(5 * time.Minute)
	if err != nil {
		return "", err
	}
	return presignedURL, nil
}
