package handlers

import (
	"context"
	"database/sql"
	"fmt"
)

// Handler holds shared dependencies for all route handlers.
type Handler struct {
	DB *sql.DB
}

// New creates a new Handler with the given database connection.
func New(db *sql.DB) *Handler {
	return &Handler{DB: db}
}

// QueryRows executes a query and returns the results as a slice of maps.
func (h *Handler) QueryRows(ctx context.Context, query string, args ...interface{}) ([]map[string]interface{}, []string, error) {
	rows, err := h.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, nil, fmt.Errorf("query failed: %w", err)
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, nil, fmt.Errorf("columns: %w", err)
	}

	var results []map[string]interface{}
	for rows.Next() {
		values := make([]interface{}, len(columns))
		pointers := make([]interface{}, len(columns))
		for i := range values {
			pointers[i] = &values[i]
		}
		if err := rows.Scan(pointers...); err != nil {
			return nil, nil, fmt.Errorf("scan: %w", err)
		}
		row := make(map[string]interface{}, len(columns))
		for i, col := range columns {
			val := values[i]
			if b, ok := val.([]byte); ok {
				val = string(b)
			}
			row[col] = val
		}
		results = append(results, row)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, fmt.Errorf("rows iteration: %w", err)
	}

	return results, columns, nil
}
