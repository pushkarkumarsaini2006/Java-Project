#!/bin/bash

# Library Management System - Spring Boot Backend
# Start script

echo "Starting Library Management System Backend..."

# Check if Java is installed
if ! command -v java &> /dev/null
then
    echo "Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null
then
    echo "Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "Make sure MongoDB is running on localhost:27017"

# Build and run the application
echo "Building application..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo "Build successful. Starting server..."
    mvn spring-boot:run
else
    echo "Build failed. Please check for errors."
    exit 1
fi