# Build Stage
FROM  golang:1.23-bookworm  AS builder

# Set the working directory inside the container
WORKDIR /app

# Install certificates for secure communication
RUN apt-get update && apt-get install -y ca-certificates

# Copy the Go modules files for dependency installation
COPY go.mod go.sum ./

# Download Go module dependencies
RUN go mod download

# Copy the rest of the application files
COPY . .

# Build the Go application with CGO enabled for certificate validation
RUN CGO_ENABLED=1 GOOS=linux go build -o /myapp .

# Final Stage
FROM debian:bookworm-slim

# Install necessary certificates and update CA store
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the CA certificate into the container
COPY google_cert.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

# Set working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /myapp /app/myapp

# Copy configuration files into the container
COPY .env /app/.env
COPY config.yaml /app/config.yaml
COPY google-service.json /app/google-service.json

# Expose the application port
EXPOSE 8000

# Ensure the executable has the right permissions
RUN chmod +x /app/myapp

# Command to run the application
CMD ["/app/myapp"]
