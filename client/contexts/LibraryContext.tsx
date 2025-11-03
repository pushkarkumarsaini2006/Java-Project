import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// Types (matching server types)
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  available: number;
  description?: string;
  addedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
  role: 'admin' | 'member';
}

export interface Borrow {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  isOverdue: boolean;
}

interface LibraryContextType {
  // Books
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'addedAt' | 'available'>) => Promise<boolean>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
  
  // Members
  members: Member[];
  deleteMember: (id: string) => Promise<boolean>;
  
  // Borrows (previously Loans)
  borrows: Borrow[];
  userBorrows: Borrow[];
  borrowBook: (bookId: string) => Promise<boolean>;
  returnBook: (borrowId: string) => Promise<boolean>;
  
  // State
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}

interface LibraryProviderProps {
  children: ReactNode;
}

export function LibraryProvider({ children }: LibraryProviderProps) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to make authenticated API calls
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("leafstack_token");
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  };

  // Fetch all data
  const refreshData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [booksData, borrowsData, membersData] = await Promise.all([
        apiCall("/api/books"),
        user.role === "admin" 
          ? apiCall("/api/loans") // Admin gets all borrows
          : apiCall(`/api/loans?memberId=${user.id}`), // Users get only their borrows
        user.role === "admin" ? apiCall("/api/members") : Promise.resolve([])
      ]);

      setBooks(booksData);
      setBorrows(borrowsData);
      if (user.role === "admin") {
        setMembers(membersData);
      }
    } catch (error) {
      console.error("Failed to fetch library data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Book operations
  const addBook = async (bookData: Omit<Book, 'id' | 'addedAt' | 'available'>) => {
    try {
      const newBook = await apiCall("/api/books", {
        method: "POST",
        body: JSON.stringify({ ...bookData, available: bookData.copies }),
      });
      setBooks(prev => [...prev, newBook]);
      return true;
    } catch (error) {
      console.error("Failed to add book:", error);
      return false;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const updatedBook = await apiCall(`/api/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
      return true;
    } catch (error) {
      console.error("Failed to update book:", error);
      return false;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await apiCall(`/api/books/${id}`, { method: "DELETE" });
      setBooks(prev => prev.filter(book => book.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete book:", error);
      return false;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await apiCall(`/api/members/${id}`, { method: "DELETE" });
      setMembers(prev => prev.filter(member => member.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete member:", error);
      return false;
    }
  };

  // Borrow operations
  const borrowBook = async (bookId: string) => {
    if (!user) return false;
    
    try {
      const newBorrow = await apiCall("/api/loans/borrow", {
        method: "POST",
        body: JSON.stringify({
          bookId,
          memberId: user.id,
          memberName: user.name,
        }),
      });
      
      setBorrows(prev => [...prev, newBorrow]);
      
      // Update book availability
      setBooks(prev => prev.map(book => 
        book.id === bookId 
          ? { ...book, available: book.available - 1 }
          : book
      ));
      
      return true;
    } catch (error) {
      console.error("Failed to borrow book:", error);
      return false;
    }
  };

  const returnBook = async (borrowId: string) => {
    try {
      const updatedBorrow = await apiCall(`/api/loans/${borrowId}/return`, {
        method: "PUT",
      });
      
      setBorrows(prev => prev.map(borrow => 
        borrow.id === borrowId ? updatedBorrow : borrow
      ));
      
      // Update book availability
      const borrow = borrows.find(b => b.id === borrowId);
      if (borrow) {
        setBooks(prev => prev.map(book => 
          book.id === borrow.bookId 
            ? { ...book, available: book.available + 1 }
            : book
        ));
      }
      
      return true;
    } catch (error) {
      console.error("Failed to return book:", error);
      return false;
    }
  };

  // Computed values
  const userBorrows = user ? 
    (user.role === "admin" 
      ? borrows.filter(borrow => borrow.userId === user.id && !borrow.returnedAt)
      : borrows.filter(borrow => !borrow.returnedAt) // For users, all borrows are theirs
    ) : [];

  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        members,
        deleteMember,
        borrows,
        userBorrows,
        borrowBook,
        returnBook,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}