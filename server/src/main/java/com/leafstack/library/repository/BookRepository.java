package com.leafstack.library.repository;

import com.leafstack.library.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    List<Book> findByCategory(String category);
    boolean existsByIsbn(String isbn);
}