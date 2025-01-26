package repository

import (
	"fmt"
	"net/smtp"
	"os"
	"github.com/jordan-wright/email"
)

type EmailRepository interface {
	SendEmail(to []string, subject string, body string) error
}

type emailRepository struct {
	emailClient *email.Email
}

func NewEmailRepository(emailClient *email.Email) EmailRepository {
	return &emailRepository{emailClient}
}

func (e *emailRepository) SendEmail(to  []string, subject string, body string) error {
	from := os.Getenv(("GOOGLE_EMAIL"))
	password := os.Getenv("GOOGLE_APP_PASSWORD")

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	message := []byte(body)
	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		fmt.Println(err)
		
	}
	fmt.Println("Email Sent Successfully!")
	return nil
}
