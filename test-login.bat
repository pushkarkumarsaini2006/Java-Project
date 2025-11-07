@echo off
echo Testing Login API...
echo.

echo Creating new test user...
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"

echo.
echo.
echo Testing login with new user...
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"

echo.
pause