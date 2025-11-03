import { useMemo, useState } from "react";
import { useLibrary, type Book, type Member, type Borrow } from "@/contexts/LibraryContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Edit, Plus, Search, Trash2, BookOpenCheck, Undo2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OriginalLibrarySystem() {
  const { 
    books, 
    members, 
    borrows, 
    addBook, 
    updateBook, 
    deleteBook, 
    borrowBook, 
    returnBook, 
    isLoading 
  } = useLibrary();

  const stats = useMemo(() => {
    const totalBooks = books.reduce((acc, b) => acc + b.copies, 0);
    const available = books.reduce((acc, b) => acc + b.available, 0);
    const activeBorrows = borrows.filter(l => !l.returnedAt).length;
    const overdueBorrows = borrows.filter(l => !l.returnedAt && l.isOverdue).length;
    return { totalBooks, available, activeBorrows, overdueBorrows };
  }, [books, borrows]);

  const [tab, setTab] = useState("books");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Library Management</h1>
          <p className="text-muted-foreground">Manage books, members, and borrows.</p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Copies" value={stats.totalBooks} icon={<BookOpenCheck className="size-4" />} />
        <StatCard title="Available" value={stats.available} icon={<CheckCircle2 className="size-4" />} />
        <StatCard title="Active Borrows" value={stats.activeBorrows} icon={<Search className="size-4" />} />
        <StatCard title="Overdue" value={stats.overdueBorrows} icon={<Search className="size-4" />} accent={stats.overdueBorrows > 0} />
      </section>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="borrow">Borrow</TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BookManagement
            books={books}
            onCreate={async (bookData) => {
              const success = await addBook(bookData);
              if (success) {
                toast({ title: "Success", description: "Book added successfully" });
              } else {
                toast({ title: "Error", description: "Failed to add book", variant: "destructive" });
              }
            }}
            onUpdate={async (bookData) => {
              const success = await updateBook(bookData.id, bookData);
              if (success) {
                toast({ title: "Success", description: "Book updated successfully" });
              } else {
                toast({ title: "Error", description: "Failed to update book", variant: "destructive" });
              }
            }}
            onDelete={async (id) => {
              const success = await deleteBook(id);
              if (success) {
                toast({ title: "Success", description: "Book deleted successfully" });
              } else {
                toast({ title: "Error", description: "Failed to delete book", variant: "destructive" });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="members">
          <MemberManagement
            members={members}
          />
        </TabsContent>

        <TabsContent value="borrow">
          <BorrowManagement
            books={books}
            members={members}
            borrows={borrows}
            onBorrow={borrowBook}
            onReturn={returnBook}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  accent = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-2xl font-bold", accent && "text-red-600")}>{value}</p>
        </div>
        <div className={cn("text-muted-foreground", accent && "text-red-500")}>{icon}</div>
      </div>
    </Card>
  );
}

// Book Management Component
function BookManagement({
  books,
  onCreate,
  onUpdate,
  onDelete,
}: {
  books: Book[];
  onCreate: (book: Omit<Book, "id" | "addedAt" | "available">) => Promise<void>;
  onUpdate: (book: Book) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Books ({books.length})</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <BookFormDialog
            trigger={
              <Button>
                <Plus className="size-4" />
                Add Book
              </Button>
            }
            onSubmit={async (bookData) => {
              await onCreate(bookData);
              setIsCreateOpen(false);
            }}
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{book.category}</Badge>
                </TableCell>
                <TableCell>{book.copies}</TableCell>
                <TableCell>
                  <Badge variant={book.available > 0 ? "default" : "destructive"}>
                    {book.available}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditBook(book)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(book.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editBook && (
        <BookFormDialog
          book={editBook}
          trigger={null}
          onSubmit={async (bookData) => {
            await onUpdate({ ...editBook, ...bookData });
            setEditBook(null);
          }}
          open={!!editBook}
          onOpenChange={() => setEditBook(null)}
        />
      )}
    </Card>
  );
}

// Book Form Dialog
function BookFormDialog({
  book,
  trigger,
  onSubmit,
  open,
  onOpenChange,
}: {
  book?: Book;
  trigger: React.ReactNode;
  onSubmit: (book: Omit<Book, "id" | "addedAt" | "available">) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    category: book?.category || "",
    copies: book?.copies || 1,
    description: book?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!book) {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "",
        copies: 1,
        description: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {book ? "Update book information." : "Add a new book to the library."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">ISBN</label>
              <Input
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Copies</label>
              <Input
                type="number"
                min="1"
                value={formData.copies}
                onChange={(e) => setFormData({ ...formData, copies: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{book ? "Update" : "Add"} Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Member Management Component
function MemberManagement({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Members ({members.length})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone || "N/A"}</TableCell>
                <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

// Borrow Management Component
function BorrowManagement({
  books,
  members,
  borrows,
  onBorrow,
  onReturn,
}: {
  books: Book[];
  members: Member[];
  borrows: Borrow[];
  onBorrow: (bookId: string) => Promise<boolean>;
  onReturn: (borrowId: string) => Promise<boolean>;
}) {
  const [search, setSearch] = useState("");

  const filteredBorrows = useMemo(() => {
    return borrows.filter(
      (borrow) =>
        borrow.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
        borrow.userName.toLowerCase().includes(search.toLowerCase())
    );
  }, [borrows, search]);

  const handleReturn = async (borrowId: string) => {
    const success = await onReturn(borrowId);
    if (success) {
      toast({ title: "Success", description: "Book returned successfully" });
    } else {
      toast({ title: "Error", description: "Failed to return book", variant: "destructive" });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Active Borrows ({borrows.filter(l => !l.returnedAt).length})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search borrows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Borrowed</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBorrows.filter(borrow => !borrow.returnedAt).map((borrow) => (
              <TableRow key={borrow.id}>
                <TableCell className="font-medium">{borrow.bookTitle}</TableCell>
                <TableCell>{borrow.userName}</TableCell>
                <TableCell>{new Date(borrow.borrowedAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(borrow.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={borrow.isOverdue ? "destructive" : "default"}>
                    {borrow.isOverdue ? "Overdue" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReturn(borrow.id)}
                  >
                    <Undo2 className="size-4" />
                    Return
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}