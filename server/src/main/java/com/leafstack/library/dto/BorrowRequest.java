package com.leafstack.library.dto;

import jakarta.validation.constraints.NotBlank;

public class BorrowRequest {
    @NotBlank(message = "Book ID is required")
    private String bookId;
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "User name is required")
    private String userName;
    
    // Constructors
    public BorrowRequest() {}
    
    public BorrowRequest(String bookId, String userId, String userName) {
        this.bookId = bookId;
        this.userId = userId;
        this.userName = userName;
    }
    
    // Getters and Setters
    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
}