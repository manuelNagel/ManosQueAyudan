package services

import (
	"fmt"
	"net/smtp"
)

type EmailService struct {
	SMTPHost    string
	SMTPPort    string
	SenderEmail string
	SenderPass  string
}

func NewEmailService(host, port, email, pass string) *EmailService {
	return &EmailService{
		SMTPHost:    host,
		SMTPPort:    port,
		SenderEmail: email,
		SenderPass:  pass,
	}
}

func (e *EmailService) SendEmail(to, subject, body string) error {
	auth := smtp.PlainAuth("", e.SenderEmail, e.SenderPass, e.SMTPHost)
	msg := []byte(fmt.Sprintf("Subject: %s\r\n\r\n%s", subject, body))
	return smtp.SendMail(e.SMTPHost+":"+e.SMTPPort, auth, e.SenderEmail, []string{to}, msg)
}
