package com.leafstack.library.dto;

import jakarta.validation.constraints.*;

public class BookRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    @NotBlank(message = "ISBN is required")
    private String isbn;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Copies count is required")
    @Min(value = 1, message = "Copies must be at least 1")
    private Integer copies;
    
    private String description;
    
    // Constructors
    public BookRequest() {}
    
    public BookRequest(String title, String author, String isbn, String category, Integer copies, String description) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.copies = copies;
        this.description = description;
    }
    
    // Getters and Setters
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
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}