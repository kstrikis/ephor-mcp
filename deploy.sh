#!/bin/bash

# Exit on any error
set -e

# Detect the Linux distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Installing Docker..."
    
    if [[ "$OS" == *"Amazon Linux"* ]]; then
        # Amazon Linux installation
        sudo yum update -y
        sudo yum install -y docker
        sudo systemctl enable docker
        sudo systemctl start docker
    else
        # Ubuntu installation
        sudo apt-get update
        sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        sudo apt-get update
        sudo apt-get install -y docker-ce
        sudo systemctl enable docker
        sudo systemctl start docker
    fi
    
    sudo usermod -aG docker $USER
    echo "Docker installed successfully!"
    echo "NOTE: You may need to log out and log back in for group changes to take effect."
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully!"
fi

echo "Building Docker image..."
sudo docker-compose build

echo "Starting Docker container..."
sudo docker-compose up -d

# Get the EC2 public IP address
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "Deployment completed successfully!"
echo "MCP server is running at http://$PUBLIC_IP:62886"
echo "Available endpoints:"
echo "- SSE: http://$PUBLIC_IP:62886/sse"
echo "- Messages: http://$PUBLIC_IP:62886/messages"
echo ""
echo "Note: Make sure port 62886 is open in your EC2 security group!" 