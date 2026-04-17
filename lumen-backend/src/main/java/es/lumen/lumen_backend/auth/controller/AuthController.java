package es.lumen.lumen_backend.auth.controller;

import es.lumen.lumen_backend.auth.dto.AuthUserResponse;
import es.lumen.lumen_backend.auth.dto.LoginRequest;
import es.lumen.lumen_backend.auth.dto.LoginResponse;
import es.lumen.lumen_backend.auth.dto.LogoutResponse;
import es.lumen.lumen_backend.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) { return ResponseEntity.ok(authService.login(request)); }
    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> me(Authentication authentication) { return ResponseEntity.ok(authService.me(authentication.getName())); }
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() { return ResponseEntity.ok(new LogoutResponse("Logout correcto. El cliente debe eliminar el token.")); }
}
