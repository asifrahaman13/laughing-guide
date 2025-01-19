package repository

import (
	"bytes"
	"io"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type AwsRepository interface {
	DownloadFile(bucketName, fileName string) (string, error)
	UploadFile(bucketName, fileName string, file io.Reader) error
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

func (r *awsRepository) UploadFile(bucketName, fileName string, file io.Reader) error {
	region := os.Getenv("AWS_REGION")
	_, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
	})
	if err != nil {
		return err
	}

	buffer := bytes.NewBuffer(nil)
	_, err = buffer.ReadFrom(file)
	if err != nil {
		return err
	}

	_, err = r.s3Client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
		Body:   bytes.NewReader(buffer.Bytes()),
		ACL:    aws.String("private"),
	})
	return err
}
