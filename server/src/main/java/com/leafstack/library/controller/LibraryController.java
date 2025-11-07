package com.leafstack.library.controller;

import com.leafstack.library.dto.*;
import com.leafstack.library.security.UserPrincipal;
import com.leafstack.library.service.BookService;
import com.leafstack.library.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    @Autowired
    private BookService bookService;

    @Autowired
    private BorrowService borrowService;

    // Book endpoints
    @GetMapping("/books")
    public ResponseEntity<List<BookResponse>> getBooks() {
        List<BookResponse> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<?> getBook(@PathVariable String id) {
        try {
            BookResponse book = bookService.getBookById(id);
            return ResponseEntity.ok(book);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/admin/books")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addBook(@Valid @RequestBody BookRequest bookRequest) {
        try {
            BookResponse book = bookService.addBook(bookRequest);
            return ResponseEntity.ok(book);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/admin/books/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBook(@PathVariable String id, @Valid @RequestBody BookRequest bookRequest) {
        try {
            BookResponse book = bookService.updateBook(id, bookRequest);
            return ResponseEntity.ok(book);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/books/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBook(@PathVariable String id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok(Map.of("message", "Book deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/books/search")
    public ResponseEntity<List<BookResponse>> searchBooks(@RequestParam String query) {
        List<BookResponse> books = bookService.searchBooks(query);
        return ResponseEntity.ok(books);
    }

    // Borrow endpoints
    @GetMapping("/admin/borrows")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BorrowResponse>> getAllBorrows() {
        List<BorrowResponse> borrows = borrowService.getAllBorrows();
        return ResponseEntity.ok(borrows);
    }

    @GetMapping("/borrows/my")
    public ResponseEntity<List<BorrowResponse>> getMyBorrows(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<BorrowResponse> borrows = borrowService.getUserBorrows(userPrincipal.getUserId());
        return ResponseEntity.ok(borrows);
    }

    @PostMapping("/borrows")
    public ResponseEntity<?> borrowBook(@Valid @RequestBody BorrowRequest borrowRequest, 
                                       Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // Override user info from token
            borrowRequest.setUserId(userPrincipal.getUserId());
            borrowRequest.setUserName(userPrincipal.getEmail()); // Using email as name for now
            
            BorrowResponse borrow = borrowService.borrowBook(borrowRequest);
            return ResponseEntity.ok(borrow);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/borrows/{id}/return")
    public ResponseEntity<?> returnBook(@PathVariable String id) {
        try {
            BorrowResponse borrow = borrowService.returnBook(id);
            return ResponseEntity.ok(borrow);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}