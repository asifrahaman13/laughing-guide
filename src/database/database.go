package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/asifrahaman13/laughing-guide/src/config"
	_ "github.com/lib/pq"
)

var Database *sql.DB

func InitDB() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=%s",
		cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBHost, cfg.DBPort, cfg.DBSSLMode)
	Database, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if cfg.GinMode == "debug" {
		dropEmployeesTable := `DROP TABLE IF EXISTS employees;`
		dropPayrollDataTable := `DROP TABLE IF EXISTS payroll_data;`
		dropOrganizationsTable := `DROP TABLE IF EXISTS organizations;`

		_, err = Database.Exec(dropEmployeesTable)
		if err != nil {
			log.Fatal(err)
		}

		_, err = Database.Exec(dropPayrollDataTable)
		if err != nil {
			log.Fatal(err)
		}

		_, err = Database.Exec(dropOrganizationsTable)
		if err != nil {
			log.Fatal(err)
		}

		log.Println("All tables dropped successfully.")

	}

	createTableSQL := `CREATE TABLE IF NOT EXISTS employees (
	    organization_id VARCHAR(50) NOT NULL,
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

	createOrganizations := `CREATE TABLE IF NOT EXISTS organizations (
		organization_id VARCHAR(50) PRIMARY KEY,
		organization_name VARCHAR(255) NOT NULL,
		organization_email VARCHAR(255) NOT NULL
	);`

	_, err = Database.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}
	_, err = Database.Exec(createTableSQL2)
	if err != nil {
		log.Fatal(err)
	}

	_, err = Database.Exec(createOrganizations)
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
