package com.leafstack.library.dto;

public class BorrowResponse {
    private String id;
    private String bookId;
    private String userId;
    private String userName;
    private String borrowDate;
    private String dueDate;
    private String returnDate;
    private String status;
    private String bookTitle;
    private String bookAuthor;
    
    // Constructors
    public BorrowResponse() {}
    
    public BorrowResponse(String id, String bookId, String userId, String userName, 
                         String borrowDate, String dueDate, String returnDate, String status,
                         String bookTitle, String bookAuthor) {
        this.id = id;
        this.bookId = bookId;
        this.userId = userId;
        this.userName = userName;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getBorrowDate() { return borrowDate; }
    public void setBorrowDate(String borrowDate) { this.borrowDate = borrowDate; }
    
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    
    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    
    public String getBookAuthor() { return bookAuthor; }
    public void setBookAuthor(String bookAuthor) { this.bookAuthor = bookAuthor; }
}