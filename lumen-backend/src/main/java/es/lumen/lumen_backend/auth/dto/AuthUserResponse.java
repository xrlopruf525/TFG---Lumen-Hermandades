package es.lumen.lumen_backend.auth.dto;

import java.util.List;

public class AuthUserResponse {
    private String username;
    private List<String> roles;

    public AuthUserResponse() {}

    public AuthUserResponse(String username, List<String> roles) {
        this.username = username;
        this.roles = roles;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
