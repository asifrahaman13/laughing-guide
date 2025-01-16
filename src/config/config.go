package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    DBUser     string
    DBPassword string
    DBName     string
    DBHost     string
    DBPort     string
    DBSSLMode  string
    GinMode    string
    Port       string
}

func LoadConfig() (*Config, error) {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using default environment variables")
    }

    config := &Config{
        DBUser:     os.Getenv("DB_USER"),
        DBPassword: os.Getenv("DB_PASSWORD"),
        DBName:     os.Getenv("DB_NAME"),
        DBHost:     os.Getenv("DB_HOST"),
        DBPort:     os.Getenv("DB_PORT"),
        DBSSLMode:  os.Getenv("DB_SSLMODE"),
        GinMode:    os.Getenv("GIN_MODE"),
        Port:       os.Getenv("PORT"),
    }

    if config.Port == "" {
        config.Port = "8000"
    }

    return config, nil
}