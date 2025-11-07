package com.leafstack.library.dto;

import com.leafstack.library.model.Book;
import java.time.LocalDateTime;

public class BookResponse {
    private String id;
    private String title;
    private String author;
    private String isbn;
    private String category;
    private Integer copies;
    private Integer available;
    private String description;
    private String addedAt;
    
    // Constructors
    public BookResponse() {}
    
    public BookResponse(String id, String title, String author, String isbn, String category, 
                       Integer copies, Integer available, String description, String addedAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.copies = copies;
        this.available = available;
        this.description = description;
        this.addedAt = addedAt;
    }
    
    public static BookResponse fromBook(Book book) {
        return new BookResponse(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            book.getIsbn(),
            book.getCategory(),
            book.getCopies(),
            book.getAvailable(),
            book.getDescription(),
            book.getCreatedAt() != null ? book.getCreatedAt().toString() : null
        );
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
    
    public String getAddedAt() { return addedAt; }
    public void setAddedAt(String addedAt) { this.addedAt = addedAt; }
}