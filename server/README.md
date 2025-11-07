# Library Management System - Spring Boot Backend

This is the Spring Boot backend for the Library Management System, replacing the previous Express.js backend.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/Member)
  - Secure password hashing with BCrypt

- **Book Management**
  - CRUD operations for books
  - Book availability tracking
  - Search functionality

- **Borrowing System**
  - Borrow and return books
  - Track borrowing history
  - Due date management

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT authentication)
- **Spring Data MongoDB**
- **MongoDB** (Database)
- **Maven** (Build tool)

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 4.0+

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Configure MongoDB**
   - Install and start MongoDB
   - Update `application.properties` if needed:
     ```properties
     spring.data.mongodb.uri=mongodb://localhost:27017/library-db
     ```

3. **Configure JWT Secret**
   - Update the JWT secret in `application.properties`:
     ```properties
     jwt.secret=your-secret-key-here
     ```

4. **Build and run**
   ```bash
   mvn spring-boot:run
   ```

The server will start on http://localhost:8080

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/register` - User registration

### Books
- `GET /api/library/books` - Get all books
- `GET /api/library/books/{id}` - Get book by ID
- `GET /api/library/books/search?query=` - Search books
- `POST /api/library/admin/books` - Add book (Admin only)
- `PUT /api/library/admin/books/{id}` - Update book (Admin only)
- `DELETE /api/library/admin/books/{id}` - Delete book (Admin only)

### Borrowing
- `GET /api/library/borrows/my` - Get user's borrows
- `POST /api/library/borrows` - Borrow a book
- `PUT /api/library/borrows/{id}/return` - Return a book
- `GET /api/library/admin/borrows` - Get all borrows (Admin only)

### Demo
- `GET /api/demo` - Test endpoint

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "name": "string", 
  "email": "string",
  "password": "string (hashed)",
  "role": "admin|member",
  "phone": "string",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Books Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "author": "string",
  "isbn": "string",
  "category": "string",
  "copies": "number",
  "available": "number",
  "description": "string",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Borrows Collection
```json
{
  "_id": "ObjectId",
  "bookId": "string",
  "userId": "string", 
  "userName": "string",
  "borrowDate": "DateTime",
  "dueDate": "DateTime",
  "returnDate": "DateTime",
  "status": "borrowed|returned|overdue",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

## Configuration

The application can be configured via `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# MongoDB Configuration  
spring.data.mongodb.uri=mongodb://localhost:27017/library-db

# JWT Configuration
jwt.secret=leafstack-secret-key-2025
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:3000,http://localhost:5173
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

## Default Admin User

To create an admin user, you can register a user and then manually update their role in the database:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);
```

## Migration from Express.js

This Spring Boot backend provides the same API endpoints and functionality as the previous Express.js backend:

- All routes maintain the same paths and HTTP methods
- Request/response formats are identical
- Authentication mechanism (JWT) works the same way
- Database schema remains unchanged

The frontend should work without any changes.

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package
java -jar target/library-backend-1.0.0.jar
```

### Docker Support (Optional)
You can containerize the application:

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/library-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check the connection string in `application.properties`

2. **JWT Token Issues**
   - Verify the JWT secret is set correctly
   - Check token expiration settings

3. **CORS Issues**
   - Update allowed origins in `application.properties`
   - Ensure frontend URL is included

## License

This project is part of the Leafstack Library Management System.