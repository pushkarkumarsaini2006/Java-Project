package com.leafstack.library.service;

import com.leafstack.library.dto.*;
import com.leafstack.library.model.Book;
import com.leafstack.library.model.Borrow;
import com.leafstack.library.model.User;
import com.leafstack.library.repository.BookRepository;
import com.leafstack.library.repository.BorrowRepository;
import com.leafstack.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BorrowService {

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BorrowResponse> getAllBorrows() {
        List<Borrow> borrows = borrowRepository.findAll();
        return borrows.stream()
                .map(this::convertToBorrowResponse)
                .collect(Collectors.toList());
    }

    public List<BorrowResponse> getUserBorrows(String userId) {
        List<Borrow> borrows = borrowRepository.findByUserId(userId);
        return borrows.stream()
                .map(this::convertToBorrowResponse)
                .collect(Collectors.toList());
    }

    public BorrowResponse borrowBook(BorrowRequest borrowRequest) {
        // Check if book exists and is available
        Optional<Book> bookOpt = bookRepository.findById(borrowRequest.getBookId());
        if (!bookOpt.isPresent()) {
            throw new RuntimeException("Book not found");
        }

        Book book = bookOpt.get();
        if (book.getAvailable() <= 0) {
            throw new RuntimeException("Book is not available");
        }

        // Check if user exists
        Optional<User> userOpt = userRepository.findById(borrowRequest.getUserId());
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }

        // Check if user already borrowed this book
        Optional<Borrow> existingBorrow = borrowRepository.findByBookIdAndUserIdAndStatus(
            borrowRequest.getBookId(), borrowRequest.getUserId(), Borrow.Status.BORROWED);
        if (existingBorrow.isPresent()) {
            throw new RuntimeException("User has already borrowed this book");
        }

        // Create new borrow record
        Borrow borrow = new Borrow(
            borrowRequest.getBookId(),
            borrowRequest.getUserId(),
            borrowRequest.getUserName()
        );

        // Update book availability
        book.setAvailable(book.getAvailable() - 1);
        bookRepository.save(book);

        // Save borrow record
        Borrow savedBorrow = borrowRepository.save(borrow);
        return convertToBorrowResponse(savedBorrow);
    }

    public BorrowResponse returnBook(String borrowId) {
        Optional<Borrow> borrowOpt = borrowRepository.findById(borrowId);
        if (!borrowOpt.isPresent()) {
            throw new RuntimeException("Borrow record not found");
        }

        Borrow borrow = borrowOpt.get();
        if (borrow.getStatus() != Borrow.Status.BORROWED) {
            throw new RuntimeException("Book is not currently borrowed");
        }

        // Update borrow record
        borrow.setStatus(Borrow.Status.RETURNED);
        borrow.setReturnDate(LocalDateTime.now());

        // Update book availability
        Optional<Book> bookOpt = bookRepository.findById(borrow.getBookId());
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setAvailable(book.getAvailable() + 1);
            bookRepository.save(book);
        }

        // Save updated borrow record
        Borrow savedBorrow = borrowRepository.save(borrow);
        return convertToBorrowResponse(savedBorrow);
    }

    private BorrowResponse convertToBorrowResponse(Borrow borrow) {
        BorrowResponse response = new BorrowResponse();
        response.setId(borrow.getId());
        response.setBookId(borrow.getBookId());
        response.setUserId(borrow.getUserId());
        response.setUserName(borrow.getUserName());
        response.setBorrowDate(borrow.getBorrowDate() != null ? borrow.getBorrowDate().toString() : null);
        response.setDueDate(borrow.getDueDate() != null ? borrow.getDueDate().toString() : null);
        response.setReturnDate(borrow.getReturnDate() != null ? borrow.getReturnDate().toString() : null);
        response.setStatus(borrow.getStatus().getValue());

        // Get book details
        Optional<Book> bookOpt = bookRepository.findById(borrow.getBookId());
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            response.setBookTitle(book.getTitle());
            response.setBookAuthor(book.getAuthor());
        }

        return response;
    }
}