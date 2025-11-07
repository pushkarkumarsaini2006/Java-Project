package com.leafstack.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Document(collection = "books")
public class Book {
    @Id
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    @NotBlank(message = "ISBN is required")
    @Indexed(unique = true)
    private String isbn;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Copies count is required")
    @Min(value = 1, message = "Copies must be at least 1")
    private Integer copies;
    
    @NotNull(message = "Available count is required")
    @Min(value = 0, message = "Available count cannot be negative")
    private Integer available;
    
    private String description;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Book() {}
    
    public Book(String title, String author, String isbn, String category, Integer copies, String description) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.copies = copies;
        this.available = copies; // Initially all copies are available
        this.description = description;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Integer getCopies() { return copies; }
    public void setCopies(Integer copies) { this.copies = copies; }
    
    public Integer getAvailable() { return available; }
    public void setAvailable(Integer available) { this.available = available; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}