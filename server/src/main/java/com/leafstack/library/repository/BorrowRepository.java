package com.leafstack.library.repository;

import com.leafstack.library.model.Borrow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRepository extends MongoRepository<Borrow, String> {
    List<Borrow> findByUserId(String userId);
    List<Borrow> findByBookId(String bookId);
    List<Borrow> findByStatus(Borrow.Status status);
    Optional<Borrow> findByBookIdAndUserIdAndStatus(String bookId, String userId, Borrow.Status status);
    List<Borrow> findByUserIdAndStatus(String userId, Borrow.Status status);
    List<Borrow> findByBookIdAndStatus(String bookId, Borrow.Status status);
}