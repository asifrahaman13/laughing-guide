package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
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

func LoadGoogleConfig() *oauth2.Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default environment variables")
	}
	var (
		Oauth2Config = &oauth2.Config{
			ClientID:     os.Getenv("GOOGE_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
			RedirectURL:  "http://localhost:8000/api/auth/google/callback",
			Scopes: []string{
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile",
			},
			Endpoint: google.Endpoint,
		}
	)
	return Oauth2Config
}
