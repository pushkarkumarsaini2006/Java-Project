package com.leafstack.library.config;

import com.leafstack.library.model.Book;
import com.leafstack.library.model.Borrow;
import com.leafstack.library.model.User;
import com.leafstack.library.repository.BookRepository;
import com.leafstack.library.repository.BorrowRepository;
import com.leafstack.library.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;

@Configuration
public class SampleDataSeeder {

    private static final Logger log = LoggerFactory.getLogger(SampleDataSeeder.class);

    @Bean
    CommandLineRunner seedSampleData(
            BookRepository bookRepository,
            BorrowRepository borrowRepository,
            UserRepository userRepository,
            MongoTemplate mongoTemplate
    ) {
        return args -> {
            String dbName = mongoTemplate.getDb().getName();
            log.info("MongoDB connected database: {}", dbName);
            long bookCount = bookRepository.count();
            long userCount = userRepository.count();
            long borrowCount = borrowRepository.count();
            log.info("Current counts - users: {}, books: {}, borrows: {}", userCount, bookCount, borrowCount);
            if (bookCount == 0) {
                List<Book> samples = new java.util.ArrayList<>();
                samples.add(new Book("Clean Code", "Robert C. Martin", "9780132350884", "Programming", 5, "A Handbook of Agile Software Craftsmanship"));
                samples.add(new Book("Effective Java", "Joshua Bloch", "9780134685991", "Programming", 4, "Best practices for the Java platform"));
                samples.add(new Book("Design Patterns", "Erich Gamma", "9780201633610", "Software Engineering", 3, "Elements of Reusable Object-Oriented Software"));
                bookRepository.saveAll(samples);
                log.info("Seeded sample books: {}", samples.size());
            }

            if (borrowCount == 0) {
                // Try to attach one borrow to first book for the admin user if present
                var firstBookOpt = bookRepository.findAll().stream().findFirst();
                if (firstBookOpt.isPresent()) {
                    // Prefer admin; else any user
                    User user = userRepository.findByEmail("admin@leafstack.local").orElseGet(() ->
                            userRepository.findAll().stream().findFirst().orElse(null)
                    );
                    if (user != null) {
                        Book book = firstBookOpt.get();
                        Borrow borrow = new Borrow(book.getId(), user.getId(), user.getName() != null ? user.getName() : user.getEmail());
                        borrowRepository.save(borrow);
                        // decrement availability
                        book.setAvailable(Math.max(0, book.getAvailable() - 1));
                        bookRepository.save(book);
                        log.info("Seeded one sample borrow for book '{}' by user '{}'", book.getTitle(), user.getEmail());
                    } else {
                        log.info("No user found to attach sample borrow; skipping borrow seeding");
                    }
                }
            }
        };
    }
}
