import { useAuth } from "@/contexts/AuthContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Import the existing library management components from the original Index
import OriginalLibrarySystem from "./OriginalLibrarySystemNew";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { books, members, borrows, isLoading } = useLibrary();

  const stats = {
    totalBooks: books.reduce((acc, book) => acc + book.copies, 0),
    totalMembers: members.length,
    activeBorrows: borrows.filter(borrow => !borrow.returnedAt).length,
    overdueBorrows: borrows.filter(borrow => !borrow.returnedAt && borrow.isOverdue).length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Manage your library system.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Administrator Access
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Library Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Borrows</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBorrows}</div>
            <p className="text-xs text-muted-foreground">
              Currently borrowed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${stats.overdueBorrows > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.overdueBorrows > 0 ? 'text-red-500' : ''}`}>
              {stats.overdueBorrows}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Full Library Management System */}
      <Card>
        <CardHeader>
          <CardTitle>Library Management System</CardTitle>
          <CardDescription>
            Complete system to manage books, members, and loans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OriginalLibrarySystem />
        </CardContent>
      </Card>
    </div>
  );
}