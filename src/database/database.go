package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var Database *sql.DB

func InitDB() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v\n", err)
	}

	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	sslmode := os.Getenv("DB_SSLMODE")

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=%s",
		user, password, dbname, host, port, sslmode)
	Database, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	createTableSQL := `CREATE TABLE IF NOT EXISTS employees (
		employee_id TEXT PRIMARY KEY,
		employee_profile TEXT,
		employee_email TEXT,
		employee_name TEXT,
		employee_role TEXT,
		employee_status TEXT,
		employee_salary REAL,
		employee_job_type TEXT,
		employee_resident TEXT,
		employee_age INTEGER,
		bonuses REAL
	);`

	createTableSQL2 := `CREATE TABLE IF NOT EXISTS payroll_data (
		employee_id VARCHAR(255) NOT NULL,
		gross_salary FLOAT NOT NULL,
		net_salary FLOAT NOT NULL,
		employee_contribution FLOAT NOT NULL,
		employer_contribution FLOAT NOT NULL,
		total_contribution FLOAT NOT NULL,
		bonuses FLOAT NOT NULL,
		PRIMARY KEY (employee_id)
	);`

	_, err = Database.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}
	_, err = Database.Exec(createTableSQL2)
	if err != nil {
		log.Fatal(err)
	}

	Database.SetMaxOpenConns(25)
	Database.SetMaxIdleConns(25)
	Database.SetConnMaxLifetime(5 * time.Minute)

	err = Database.Ping()
	if err != nil {
		log.Fatalf("Error connecting to the database: %v\n", err)
		panic(err)
	}
}
