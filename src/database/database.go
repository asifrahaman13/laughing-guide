package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

var Database *sql.DB

func InitDB() {
	var err error
	Database, err = sql.Open("sqlite3", "./employees.db")
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
	);
	`

	_, err = Database.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}
	_, err = Database.Exec(createTableSQL2)
	if err != nil {
		log.Fatal(err)
	}
}
