package com.leafstack.library.service;

import com.leafstack.library.dto.*;
import com.leafstack.library.model.User;
import com.leafstack.library.repository.UserRepository;
import com.leafstack.library.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail().toLowerCase();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
            user.getId(), 
            user.getEmail(), 
            user.getRole().getValue()
        );

        UserResponse userResponse = UserResponse.fromUser(user);
        return new LoginResponse(token, userResponse);
    }

    public UserResponse verify(String token) {
        if (!jwtUtil.validateToken(token) || jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            throw new RuntimeException("Invalid token: no user ID found");
        }
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }

        return UserResponse.fromUser(userOpt.get());
    }

    public UserResponse register(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail().toLowerCase())) {
            throw new RuntimeException("User with this email already exists");
        }
        
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.Role.MEMBER); // Default role
        user.setPhone(registerRequest.getPhone());

        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
}