# LeafStack Library Management System

A modern, full-stack library management system built with **React + TypeScript (Vite)** frontend and **Spring Boot (Java)** backend, using **MongoDB** for data persistence. This application provides comprehensive book management, user authentication, and loan tracking capabilities for libraries.

![Library Management System](https://img.shields.io/badge/Status-Active-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![React](https://img.shields.io/badge/Frontend-React%2018-blue) ![Spring%20Boot](https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## 🚀 Features

### User Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Book Search & Browse**: Search books by title, author, or category
- **Book Borrowing**: Borrow available books with automatic due date tracking
- **Loan Management**: View current loans, due dates, and return history
- **User Dashboard**: Personal dashboard with borrowing statistics

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel for library management
- **Book Management**: Add, edit, and remove books from the catalog
- **Member Management**: Manage library members and their accounts
- **Loan Tracking**: Monitor all active loans and overdue items
- **Library Statistics**: Overview of library usage and inventory

### Technical Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization across the application
- **Role-based Access**: Secure role-based permissions (User/Admin)
- **Modern UI**: Clean, intuitive interface built with Radix UI and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **React Router 6** - SPA routing
- **TailwindCSS 3** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Tanstack Query** - Server state management
- **Vite** - Fast build tool and dev server

### Backend
- **Java 17** - LTS runtime
- **Spring Boot 3** - REST API framework
- **Spring Security + JWT** - Authentication & authorization
- **MongoDB** - NoSQL database
- **BCrypt** - Password hashing

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Vitest** - Unit testing framework
- **Prettier** - Code formatting
- **ESLint** - Code linting

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Java 17+** - For Spring Boot backend
- **Node.js** (v18 or higher) - For React frontend development
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **MongoDB Atlas account** OR local MongoDB installation
- **Maven 3.6+** - For building Spring Boot application

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/pushkarkumarsaini2006/Java-Project.git
cd Java-Project
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. MongoDB Atlas Setup

Your Spring Boot backend is pre-configured to use MongoDB Atlas:

1. The connection string is already set in `server/src/main/resources/application.properties`
2. Database: `leafstack-library`
3. If you want to use a different MongoDB instance, update the URI in `application.properties`

For local MongoDB (optional):
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/leafstack-library
```

### 4. Start the Development Servers (Frontend + Backend)
```bash
# Start both servers together
pnpm dev:full
```

**OR start them separately:**

```bash
# Terminal 1: Start Spring Boot backend
pnpm dev:backend

# Terminal 2: Start React frontend
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api

### 5. Default Admin Account
On first run, the backend seeds a default admin account:
- **Email**: `admin@leafstack.local`
- **Password**: `admin12345`

### 6. Sample Data
The system automatically seeds sample books and borrowing data for testing.

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Radix UI component library
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Route components
│   └── App.tsx            # Main app component with routing
├── server/                # Spring Boot backend (Java)
│   ├── src/main/java/com/leafstack/library
│   │   ├── controller/    # REST controllers
│   │   ├── service/       # Business logic
│   │   ├── repository/    # Mongo repositories
│   │   ├── security/      # JWT & security config
│   │   └── config/        # App config & seeders
│   └── src/main/resources/application.properties
├── shared/                # Shared types and utilities
└── public/                # Static assets
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server (client + server)
pnpm build        # Build for production
pnpm start        # Start production server

# Testing & Quality
pnpm test         # Run tests
pnpm typecheck    # TypeScript type checking
pnpm format.fix   # Format code with Prettier
```

## 🌐 API Documentation

The backend provides REST endpoints under `/api/library/*`:

### Authentication
- `POST /api/library/auth/register` - Register new user
- `POST /api/library/auth/login` - User login
- `POST /api/library/auth/refresh` - Refresh JWT token

### Books
- `GET /api/library/books` - Get all books
- `POST /api/library/books` - Add new book (Admin only)
- `PUT /api/library/books/{id}` - Update book (Admin only)
- `DELETE /api/library/books/{id}` - Delete book (Admin only)

### Users
- `GET /api/library/users` - Get all users (Admin only)
- `GET /api/library/users/profile` - Get current user profile
- `PUT /api/library/users/profile` - Update user profile

### Borrowing
- `GET /api/library/borrows` - Get all borrows
- `POST /api/library/borrows` - Borrow a book
- `PUT /api/library/borrows/{id}/return` - Return a book

## 📦 Production Deployment

1. **Build the frontend**:
   ```bash
   pnpm build
   ```

2. **Package the backend**:
   ```bash
   cd server
   mvn clean package
   ```

3. **Deploy**:
   - **Backend**: Deploy `target/library-backend-1.0.0.jar` to your cloud provider
   - **Frontend**: Deploy the `dist/` folder to Netlify, Vercel, or any static hosting service

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication:

- **User Registration**: Users can register with email and password
- **Secure Login**: Passwords are hashed using bcrypt
- **Role-based Access**: Two roles supported (User/Admin)
- **Protected Routes**: Certain endpoints require authentication
- **Admin Features**: Some features are restricted to admin users

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'admin'
  createdAt: Date
}
```

### Book Model
```typescript
{
  title: string
  author: string
  isbn: string (unique)
  category: string
  totalCopies: number
  availableCopies: number
  createdAt: Date
}
```

### Loan Model
```typescript
{
  user: ObjectId (ref: User)
  book: ObjectId (ref: Book)
  borrowDate: Date
  dueDate: Date
  returnDate: Date (optional)
  status: 'active' | 'returned' | 'overdue'
}
```

## 🎨 UI Components

The application uses a comprehensive UI component library built on:

- **Radix UI** - Accessible, unstyled components
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Framer Motion** - Smooth animations

Available components include:
- Forms (Input, Select, Checkbox, etc.)
- Navigation (Tabs, Menubar, Breadcrumb)
- Feedback (Toast, Alert, Dialog)
- Data Display (Table, Card, Badge)
- Layout (Separator, Sidebar, Resizable panels)

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Environment Variables for Production
Frontend (Vite):
```env
VITE_API_BASE_URL=https://your-backend.example.com
```

Backend (Spring Boot):
```env
spring.data.mongodb.uri=your-production-mongodb-uri
jwt.secret=your-production-jwt-secret
cors.allowed-origins=https://your-frontend.example.com
```

### Deployment Platforms
This application can be deployed as:
- **Netlify/Vercel (Frontend SPA)** + **Render/Heroku/AWS/VM (Spring Boot API)**
- **Single VM/Kubernetes** hosting both services

For Netlify, set `VITE_API_BASE_URL` to your Spring Boot API origin. The existing `[[redirects]]` for `/api/*` targets a serverless function template and is not used when `VITE_API_BASE_URL` is configured.

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Run type checking:
```bash
pnpm typecheck
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [Fusion Starter](https://github.com/leafstack/fusion-starter) template
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [TailwindCSS](https://tailwindcss.com/)

## 📞 Support

If you have any questions or need help getting started:

1. Check the [Issues](https://github.com/pushkarkumarsaini2006/Java-Project/issues) page
2. Create a new issue if your question isn't already answered
3. For urgent matters, contact the maintainer

---

**Happy coding! 📚✨**