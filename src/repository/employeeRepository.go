package repository

import (
	"database/sql"
)

type EmployeeRepository interface {
	Execute(query string, args ...interface{}) (*sql.Rows, error)
	BeginTransaction() (*sql.Tx, error)
}

type employeeRepository struct {
	db *sql.DB
}

func NewEmployeeRepository(db *sql.DB) EmployeeRepository {
	return &employeeRepository{db}
}

func (r *employeeRepository) Execute(query string, args ...interface{}) (*sql.Rows, error) {
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *employeeRepository) BeginTransaction() (*sql.Tx, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	return tx, nil
}
