package es.lumen.lumen_backend.auth.dto;

public class AuthUserResponse {
    private String username;
    private String role;
    public AuthUserResponse() {}
    public AuthUserResponse(String username, String role) { this.username = username; this.role = role; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
