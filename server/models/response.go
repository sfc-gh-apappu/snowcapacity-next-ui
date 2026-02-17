package models

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ─── Response Envelope ──────────────────────────────────────

// ApiResponse is the standard envelope for all API responses.
type ApiResponse[T any] struct {
	Data  T        `json:"data"`
	Error *ApiError `json:"error,omitempty"`
	Meta  *Meta     `json:"meta,omitempty"`
}

// ApiError provides a consistent error shape across all endpoints.
type ApiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details any    `json:"details,omitempty"`
}

// Meta carries request-level metadata for tracing / debugging.
type Meta struct {
	RequestID  string `json:"requestId"`
	Timestamp  string `json:"timestamp"`
	DurationMs int64  `json:"durationMs"`
}

// ─── Pagination ─────────────────────────────────────────────

// Paginated wraps a list of items with pagination metadata.
type Paginated[T any] struct {
	Items         []T    `json:"items"`
	NextPageToken string `json:"nextPageToken,omitempty"`
	TotalCount    *int   `json:"totalCount,omitempty"`
}

// ─── Common Query Params ────────────────────────────────────

// PaginationParams are the standard query params for paginated endpoints.
type PaginationParams struct {
	PageSize  int    `form:"pageSize" binding:"omitempty,min=1,max=500"`
	PageToken string `form:"pageToken"`
}

// DefaultPageSize returns the page size or a default if not set.
func (p PaginationParams) DefaultPageSize(def int) int {
	if p.PageSize <= 0 {
		return def
	}
	return p.PageSize
}

// ─── Response Helpers ───────────────────────────────────────

// contextKeyStartTime is the key used to store the request start time.
type contextKey string

const startTimeKey contextKey = "reqStartTime"

// MarkStart should be called at the beginning of a handler (or via middleware)
// to record when processing began. The response helpers use this to compute duration.
func MarkStart(c *gin.Context) {
	c.Set(string(startTimeKey), time.Now())
}

func newMeta(c *gin.Context) *Meta {
	now := time.Now()
	var durationMs int64
	if start, ok := c.Get(string(startTimeKey)); ok {
		if t, ok := start.(time.Time); ok {
			durationMs = now.Sub(t).Milliseconds()
		}
	}
	return &Meta{
		RequestID:  uuid.New().String(),
		Timestamp:  now.UTC().Format(time.RFC3339),
		DurationMs: durationMs,
	}
}

// Success sends a 200 response with the given data.
func Success[T any](c *gin.Context, data T) {
	c.JSON(http.StatusOK, ApiResponse[T]{
		Data: data,
		Meta: newMeta(c),
	})
}

// Created sends a 201 response with the given data.
func Created[T any](c *gin.Context, data T) {
	c.JSON(http.StatusCreated, ApiResponse[T]{
		Data: data,
		Meta: newMeta(c),
	})
}

// SuccessPaginated sends a 200 response with paginated data.
func SuccessPaginated[T any](c *gin.Context, items []T, totalCount *int, nextPageToken string) {
	if items == nil {
		items = []T{}
	}
	c.JSON(http.StatusOK, ApiResponse[Paginated[T]]{
		Data: Paginated[T]{
			Items:         items,
			TotalCount:    totalCount,
			NextPageToken: nextPageToken,
		},
		Meta: newMeta(c),
	})
}

// Error sends an error response with the given HTTP status.
func Error(c *gin.Context, status int, code string, message string) {
	c.JSON(status, ApiResponse[any]{
		Data: nil,
		Error: &ApiError{
			Code:    code,
			Message: message,
		},
		Meta: newMeta(c),
	})
}

// ErrorWithDetails sends an error response with additional details.
func ErrorWithDetails(c *gin.Context, status int, code string, message string, details any) {
	c.JSON(status, ApiResponse[any]{
		Data: nil,
		Error: &ApiError{
			Code:    code,
			Message: message,
			Details: details,
		},
		Meta: newMeta(c),
	})
}

// ─── Common Error Codes ─────────────────────────────────────

const (
	ErrCodeInternal       = "INTERNAL_ERROR"
	ErrCodeNotFound       = "NOT_FOUND"
	ErrCodeBadRequest     = "BAD_REQUEST"
	ErrCodeUnauthorized   = "UNAUTHORIZED"
	ErrCodeForbidden      = "FORBIDDEN"
	ErrCodeConflict       = "CONFLICT"
	ErrCodeValidation     = "VALIDATION_ERROR"
	ErrCodeQueryFailed    = "QUERY_FAILED"
	ErrCodeNotImplemented = "NOT_IMPLEMENTED"
)
