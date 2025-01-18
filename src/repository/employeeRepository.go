package repository

import (
	"database/sql"
)

type DatabaseRepository interface {
	Execute(query string, args ...interface{}) (*sql.Rows, error)
	BeginTransaction() (*sql.Tx, error)
}

type databaseRepository struct {
	db *sql.DB
}

func NewDatabaseRepository(db *sql.DB) DatabaseRepository {
	return &databaseRepository{db}
}

func (r *databaseRepository) Execute(query string, args ...interface{}) (*sql.Rows, error) {
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *databaseRepository) BeginTransaction() (*sql.Tx, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	return tx, nil
}
