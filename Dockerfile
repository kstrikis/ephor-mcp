FROM node:22-alpine

WORKDIR /app

# Install required packages
RUN apk add --no-cache curl unzip bash

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Copy package.json and bun.lock
COPY package.json ./
COPY bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN bun run build

# Expose the port the app runs on
EXPOSE 62886

# Command to run the application
CMD ["bun", "start"] 