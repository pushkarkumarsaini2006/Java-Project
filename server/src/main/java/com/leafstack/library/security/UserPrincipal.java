package com.leafstack.library.security;

public class UserPrincipal {
    private String userId;
    private String email;
    private String role;
    
    public UserPrincipal(String userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }
    
    // Getters
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    
    // Setters
    public void setUserId(String userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}