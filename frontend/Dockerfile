# Use the official Bun image
FROM oven/bun:latest

# Install necessary packages for node-canvas
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libcairo2-dev \
#     libpango1.0-dev \
#     libjpeg-dev \
#     libgif-dev \
#     librsvg2-dev \
#     && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./


# Copy the rest of the frontend code
COPY . .

# Install dependencies using Bun
RUN bun install

RUN bun run build
# Expose the port on which the Next.js app runs
EXPOSE 3000

# Command to start the Next.js application
CMD ["bun", "run", "start"]