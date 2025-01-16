package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v2"
)

type Config struct {
	DBUser     string `yaml:"-"` 
	DBPassword string `yaml:"-"` 
	DBName     string `yaml:"db_name"`
	DBHost     string `yaml:"-"` 
	DBPort     string `yaml:"-"` 
	DBSSLMode  string `yaml:"-"` 
	GinMode    string `yaml:"-"` 
	Port       string `yaml:"port"` 
}

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default environment variables")
	}
	config := &Config{
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		DBSSLMode:  os.Getenv("DB_SSLMODE"),
		GinMode:    os.Getenv("GIN_MODE"),
	}
	data, err := os.ReadFile("config.yaml")
	if err != nil {
		log.Println("No config.yaml file found, using environment variables only")
	} else {
		var yamlConfig Config
		if err := yaml.Unmarshal(data, &yamlConfig); err != nil {
			return nil, err
		}
		if yamlConfig.DBName != "" {
			config.DBName = yamlConfig.DBName
		}
		if yamlConfig.Port != "" {
			config.Port = yamlConfig.Port
		}
	}
	if config.Port == "" {
		config.Port = "8000"
	}
	return config, nil
}
