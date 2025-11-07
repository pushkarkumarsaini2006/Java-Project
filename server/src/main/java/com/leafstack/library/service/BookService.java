package com.leafstack.library.service;

import com.leafstack.library.dto.*;
import com.leafstack.library.model.Book;
import com.leafstack.library.model.Borrow;
import com.leafstack.library.repository.BookRepository;
import com.leafstack.library.repository.BorrowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    public List<BookResponse> getAllBooks() {
        List<Book> books = bookRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return books.stream()
                .map(BookResponse::fromBook)
                .collect(Collectors.toList());
    }

    public BookResponse getBookById(String id) {
        Objects.requireNonNull(id, "Book ID cannot be null");
        Optional<Book> bookOpt = bookRepository.findById(id);
        if (!bookOpt.isPresent()) {
            throw new RuntimeException("Book not found");
        }
        return BookResponse.fromBook(bookOpt.get());
    }

    public BookResponse addBook(BookRequest bookRequest) {
        // Check if book with same ISBN already exists
        if (bookRepository.existsByIsbn(bookRequest.getIsbn())) {
            throw new RuntimeException("Book with this ISBN already exists");
        }

        Book book = new Book(
            bookRequest.getTitle(),
            bookRequest.getAuthor(),
            bookRequest.getIsbn(),
            bookRequest.getCategory(),
            bookRequest.getCopies(),
            bookRequest.getDescription()
        );

        Book savedBook = bookRepository.save(book);
        return BookResponse.fromBook(savedBook);
    }

    public BookResponse updateBook(String id, BookRequest bookRequest) {
        Objects.requireNonNull(id, "Book ID cannot be null");
        Optional<Book> bookOpt = bookRepository.findById(id);
        if (!bookOpt.isPresent()) {
            throw new RuntimeException("Book not found");
        }

        Book book = bookOpt.get();
        
        // Check if ISBN is being changed and if it conflicts
        if (!book.getIsbn().equals(bookRequest.getIsbn()) && 
            bookRepository.existsByIsbn(bookRequest.getIsbn())) {
            throw new RuntimeException("Book with this ISBN already exists");
        }

        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn(bookRequest.getIsbn());
        book.setCategory(bookRequest.getCategory());
        
        // Update available count if total copies changed
        int previousCopies = book.getCopies();
        int newCopies = bookRequest.getCopies();
        int difference = newCopies - previousCopies;
        book.setCopies(newCopies);
        book.setAvailable(Math.max(0, book.getAvailable() + difference));
        
        book.setDescription(bookRequest.getDescription());

        Book savedBook = bookRepository.save(book);
        return BookResponse.fromBook(savedBook);
    }

    public void deleteBook(String id) {
        Objects.requireNonNull(id, "Book ID cannot be null");
        Optional<Book> bookOpt = bookRepository.findById(id);
        if (!bookOpt.isPresent()) {
            throw new RuntimeException("Book not found");
        }

        // Check if book is currently borrowed
        List<Borrow> activeBorrows = borrowRepository.findByBookIdAndStatus(id, Borrow.Status.BORROWED);
        if (!activeBorrows.isEmpty()) {
            throw new RuntimeException("Cannot delete book with active borrows");
        }

        bookRepository.deleteById(id);
    }

    public List<BookResponse> searchBooks(String query) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(query);
        books.addAll(bookRepository.findByAuthorContainingIgnoreCase(query));
        
        return books.stream()
                .distinct()
                .map(BookResponse::fromBook)
                .collect(Collectors.toList());
    }
}