package com.leafstack.library.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    private String phone;
    
    // Constructors
    public RegisterRequest() {}
    
    public RegisterRequest(String username, String name, String email, String password, String phone) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }
    
    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}