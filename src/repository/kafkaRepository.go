package repository

import (
	"fmt"
	"net/smtp"
	"os"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type KafkaRepository interface {
	ProduceMessage(topic string, message string) error
	ConsumeMessage(topic string) error
}

type kafkarepository struct {
	kafkaClient *kafka.Producer
}

func NewKafkaRepository(kafkaClient *kafka.Producer) KafkaRepository {
	return &kafkarepository{kafkaClient}
}

func SendEmail(to []string, subject string, body string) error {
	from := "asifrahaman162@gmail.com"
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

func (k *kafkarepository) ProduceMessage(topic string, message string) error {
	p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "kafka:9092", "linger.ms": 0})
	if err != nil {
		panic(err)
	}
	defer p.Close()
	go func() {
		for e := range p.Events() {
			switch ev := e.(type) {
			case *kafka.Message:
				if ev.TopicPartition.Error != nil {
					fmt.Printf("Delivery failed: %v\n", ev.TopicPartition)
				} else {
					fmt.Printf("Delivered message to %v\n", ev.TopicPartition)

				}
			}
		}
	}()
	p.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          []byte(message),
	}, nil)

	p.Flush(1000)
	return err
}

func (k *kafkarepository) ConsumeMessage(topic string) error {
	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
		"group.id":          "myGroup",
		"auto.offset.reset": "earliest",
	})
	if err != nil {
		panic(err)
	}
	defer c.Close()
	c.Subscribe(topic, nil)
	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
			SendEmail(
				[]string{"asifrahaman137@gmail.com"},
				"Kafka Message Delivered",
				"Kafka message has been delivered successfully",
			)
		} else {
			fmt.Printf("Consumer error: %v (%v)\n", err, msg)
			return err
		}
	}
}
