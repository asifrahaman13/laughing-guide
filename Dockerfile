# Use the official Golang image as the base image
FROM golang:1.23

# Set the working directory inside the container
WORKDIR /app

# Copy the Go modules files first for better caching
COPY go.mod go.sum ./

# Download Go module dependencies
RUN go mod download

# Copy the rest of the application files
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o /myapp .

# Check if the file exists (optional, for debugging)
RUN ls -l /myapp

# Expose the port the application runs on
EXPOSE 8000

# Ensure the executable has the right permissions
RUN chmod +x /myapp

# Command to run the application
CMD ["/myapp"]
