package es.lumen.lumen_backend.auth.service.impl;

import es.lumen.lumen_backend.auth.dto.AuthUserResponse;
import es.lumen.lumen_backend.auth.dto.LoginRequest;
import es.lumen.lumen_backend.auth.dto.LoginResponse;
import es.lumen.lumen_backend.auth.service.AuthService;
import es.lumen.lumen_backend.auth.service.JwtService;
import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager; this.jwtService = jwtService; this.usuarioRepository = usuarioRepository;
    }
    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername()).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return new LoginResponse(jwtService.generateToken(usuario.getUsername()), "Bearer", usuario.getUsername(), usuario.getRole());
    }
    @Override
    public AuthUserResponse me(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return new AuthUserResponse(usuario.getUsername(), usuario.getRole());
    }
}
