# Build Stage
FROM golang:1.23 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go modules files first for better caching
COPY go.mod go.sum ./

# Download Go module dependencies
RUN go mod download

# Copy the rest of the application files
COPY . .

# Build the Go application
RUN CGO_ENABLED=1 GOOS=linux go build -o /myapp -ldflags '-linkmode external -extldflags "-static"' .

# Final Stage
FROM debian:buster-slim

# Copy the binary from the builder stage
COPY --from=builder /myapp .

# Copy the .env file into the container
COPY .env .env

# Expose the port the application runs on
EXPOSE 8000

# Ensure the executable has the right permissions
RUN chmod +x /myapp

# Command to run the application
CMD ["/myapp"]
