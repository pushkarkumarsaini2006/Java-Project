import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Search, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user } = useAuth();
  const { books, userBorrows, borrowBook, returnBook, isLoading } = useLibrary();
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowingBook, setBorrowingBook] = useState<string | null>(null);
  const [returningBook, setReturningBook] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    return books.filter(
      book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  const handleBorrowBook = async (bookId: string) => {
    setBorrowingBook(bookId);
    try {
      const success = await borrowBook(bookId);
      if (success) {
        toast({
          title: "Success!",
          description: "Book borrowed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to borrow book",
          variant: "destructive",
        });
      }
    } finally {
      setBorrowingBook(null);
    }
  };

  const handleReturnBook = async (loanId: string) => {
    setReturningBook(loanId);
    try {
      const success = await returnBook(loanId);
      if (success) {
        toast({
          title: "Success!",
          description: "Book returned successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to return book",
          variant: "destructive",
        });
      }
    } finally {
      setReturningBook(null);
    }
  };

  const stats = {
    booksLoaned: userBorrows.length,
    overdueBooks: userBorrows.filter(l => l.isOverdue).length,
    totalBooksRead: 0, // This would need historical data
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
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Discover your next great read</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card key="books-borrowed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.booksLoaned}</div>
            <p className="text-xs text-muted-foreground">Currently reading</p>
          </CardContent>
        </Card>

        <Card key="overdue-books">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertCircle className={`h-4 w-4 ${stats.overdueBooks > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.overdueBooks > 0 ? 'text-red-500' : ''}`}>
              {stats.overdueBooks}
            </div>
            <p className="text-xs text-muted-foreground">Return soon</p>
          </CardContent>
        </Card>

        <Card key="total-books">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalBooksRead}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Current Books
          </CardTitle>
          <CardDescription>Books you've borrowed and their due dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Borrowed Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userBorrows.map((borrow, index) => (
                <TableRow key={borrow.id || `borrow-${index}`}>
                  <TableCell className="font-medium">{borrow.bookTitle}</TableCell>
                  <TableCell>{new Date(borrow.borrowedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(borrow.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={borrow.isOverdue ? "destructive" : "default"}>
                      {borrow.isOverdue ? "Overdue" : "On Time"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturnBook(borrow.id)}
                      disabled={returningBook === borrow.id}
                    >
                      {returningBook === borrow.id ? "Returning..." : "Return"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {userBorrows.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No books currently borrowed. Browse the catalog below!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Book Catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Book Catalog</CardTitle>
          <CardDescription>Browse and search available books</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title, author, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <Card key={book.id || `book-${index}`} className="relative">
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">{book.category}</Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm">
                        Available: <span className="font-medium">{book.available}</span>
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" disabled={book.available === 0}>
                            {book.available > 0 ? "Borrow" : "Not Available"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Borrow "{book.title}"</DialogTitle>
                            <DialogDescription>
                              Review the book details and confirm your borrowing request.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Book Details:</h4>
                              <p><strong>Author:</strong> {book.author}</p>
                              <p><strong>ISBN:</strong> {book.isbn}</p>
                              <p><strong>Category:</strong> {book.category}</p>
                              <p className="text-sm text-muted-foreground mt-2">{book.description}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded">
                              <p className="text-sm">
                                <strong>Due Date:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                <br />
                                <span className="text-muted-foreground">
                                  Standard loan period is 14 days. Late returns may incur fees.
                                </span>
                              </p>
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={() => handleBorrowBook(book.id)}
                              disabled={borrowingBook === book.id}
                            >
                              {borrowingBook === book.id ? "Borrowing..." : "Confirm Borrow"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredBooks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No books found matching your search.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}