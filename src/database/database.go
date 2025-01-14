package database

import (
	"database/sql"
	"log"
	_ "github.com/mattn/go-sqlite3"
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

	_, err = Database.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}
}