# LeafStack Library Management System

A modern, full-stack library management system built with React, Express, TypeScript, and MongoDB. This application provides comprehensive book management, user authentication, and loan tracking capabilities for libraries.

![Library Management System](https://img.shields.io/badge/Status-Active-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![React](https://img.shields.io/badge/Frontend-React%2018-blue) ![Express](https://img.shields.io/badge/Backend-Express-lightgrey)

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
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Vitest** - Unit testing framework
- **Prettier** - Code formatting
- **ESLint** - Code linting

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **MongoDB** - Either local installation or MongoDB Atlas account

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

### 3. Environment Setup
Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leafstack-library
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/leafstack-library

# API Configuration
PING_MESSAGE="LeafStack Library API is running"
```

### 4. Database Setup

#### Option A: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `MONGODB_URI=mongodb://localhost:27017/leafstack-library`

### 5. Start the Development Server
```bash
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api

### 6. Default Admin Account
The system automatically creates a default admin account:
- **Email**: admin@library.com
- **Password**: admin123

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Radix UI component library
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Route components
│   └── App.tsx            # Main app component with routing
├── server/                # Express backend application
│   ├── config/            # Database and app configuration
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API route handlers
│   └── index.ts           # Server entry point
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

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Members
- `GET /api/members` - Get all members (Admin only)
- `POST /api/members` - Add new member (Admin only)
- `DELETE /api/members/:id` - Delete member (Admin only)

### Loans
- `GET /api/loans` - Get all loans
- `POST /api/loans/borrow` - Borrow a book
- `POST /api/loans/return` - Return a book

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
Ensure these environment variables are set in production:
```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
MONGODB_URI=your-production-mongodb-uri
PORT=3000
```

### Deployment Platforms
This application can be deployed on:
- **Vercel** - Frontend and serverless functions
- **Netlify** - Static site with serverless functions
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment
- **AWS** - EC2, Lambda, or ECS

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