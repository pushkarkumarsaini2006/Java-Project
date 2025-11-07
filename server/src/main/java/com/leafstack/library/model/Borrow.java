package com.leafstack.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Document(collection = "borrows")
public class Borrow {
    @Id
    private String id;
    
    @NotBlank(message = "Book ID is required")
    private String bookId;
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "User name is required")
    private String userName;
    
    @NotNull(message = "Borrow date is required")
    private LocalDateTime borrowDate;
    
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    
    @NotNull(message = "Status is required")
    private Status status = Status.BORROWED;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum Status {
        BORROWED("borrowed"),
        RETURNED("returned"),
        OVERDUE("overdue");
        
        private final String value;
        
        Status(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        public static Status fromString(String value) {
            for (Status status : Status.values()) {
                if (status.value.equalsIgnoreCase(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Unknown status: " + value);
        }
    }
    
    // Constructors
    public Borrow() {}
    
    public Borrow(String bookId, String userId, String userName) {
        this.bookId = bookId;
        this.userId = userId;
        this.userName = userName;
        this.borrowDate = LocalDateTime.now();
        this.dueDate = LocalDateTime.now().plusDays(14); // 2 weeks default
        this.status = Status.BORROWED;
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
    
    public LocalDateTime getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDateTime borrowDate) { this.borrowDate = borrowDate; }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public LocalDateTime getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDateTime returnDate) { this.returnDate = returnDate; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}