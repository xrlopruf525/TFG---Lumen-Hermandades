package es.lumen.lumen_backend.auth.service;

import es.lumen.lumen_backend.auth.dto.AuthUserResponse;
import es.lumen.lumen_backend.auth.dto.LoginRequest;
import es.lumen.lumen_backend.auth.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    AuthUserResponse me(String username);
}
