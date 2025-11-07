@echo off
REM Library Management System - Spring Boot Backend
REM Start script for Windows

echo Starting Library Management System Backend...

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo Java is not installed. Please install Java 17 or higher.
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if errorlevel 1 (
    echo Maven is not installed. Please install Maven 3.6 or higher.
    exit /b 1
)

REM Check if MongoDB is running (optional check)
echo Make sure MongoDB is running on localhost:27017

REM Build and run the application
echo Building application...
mvn clean compile

if %errorlevel% == 0 (
    echo Build successful. Starting server...
    mvn spring-boot:run
) else (
    echo Build failed. Please check for errors.
    exit /b 1
)