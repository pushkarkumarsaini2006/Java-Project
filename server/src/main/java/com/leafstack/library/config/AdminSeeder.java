package com.leafstack.library.config;

import com.leafstack.library.model.User;
import com.leafstack.library.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.dao.DuplicateKeyException;

@Configuration
public class AdminSeeder {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    @Value("${admin.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${admin.seed.email:admin@leafstack.local}")
    private String adminEmail;

    @Value("${admin.seed.username:admin}")
    private String adminUsername;

    @Value("${admin.seed.password:admin12345}")
    private String adminPassword;

    @Bean
    CommandLineRunner seedDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!seedEnabled) {
                return;
            }

            boolean emailExists = userRepository.existsByEmail(adminEmail.toLowerCase());
            boolean usernameExists = userRepository.existsByUsername(adminUsername);
            if (emailExists || usernameExists) {
                log.info("Admin user already exists (emailExists={}, usernameExists={})", emailExists, usernameExists);
                return;
            }

            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setName("System Administrator");
            admin.setEmail(adminEmail.toLowerCase());
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(User.Role.ADMIN);

            try {
                userRepository.save(admin);
                log.info("Seeded default admin: {} (username: {})", adminEmail, adminUsername);
            } catch (DuplicateKeyException e) {
                // Another instance may have seeded already; ignore and continue
                log.info("Admin already present (race) - skipping seeding");
            }
        };
    }
}
