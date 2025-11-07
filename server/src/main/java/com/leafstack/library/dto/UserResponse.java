package com.leafstack.library.dto;

import com.leafstack.library.model.User;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    
    // Constructors
    public UserResponse() {}
    
    public UserResponse(String id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
    
    public static UserResponse fromUser(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().getValue()
        );
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}