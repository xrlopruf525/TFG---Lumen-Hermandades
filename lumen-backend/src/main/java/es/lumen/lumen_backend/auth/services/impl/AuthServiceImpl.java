package es.lumen.lumen_backend.auth.services.impl;

import es.lumen.lumen_backend.auth.dto.AuthUserResponse;
import es.lumen.lumen_backend.auth.dto.LoginRequest;
import es.lumen.lumen_backend.auth.dto.LoginResponse;
import es.lumen.lumen_backend.auth.services.AuthService;
import es.lumen.lumen_backend.auth.services.JwtService;
import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRolRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtService jwtService, UsuarioRepository usuarioRepository, UsuarioRolRepository usuarioRolRepository) {
        this.authenticationManager = authenticationManager; this.jwtService = jwtService; this.usuarioRepository = usuarioRepository; this.usuarioRolRepository = usuarioRolRepository;
    }
    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername()).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<String> roleNames = usuarioRolRepository.findRoleNamesByUsuarioId(usuario.getId());
        if (roleNames.isEmpty() && usuario.getRole() != null) {
            roleNames = List.of(usuario.getRole());
        }

        return new LoginResponse(jwtService.generateToken(usuario.getUsername()), "Bearer", usuario.getUsername(), roleNames);
    }
    @Override
    public AuthUserResponse me(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<String> roleNames = usuarioRolRepository.findRoleNamesByUsuarioId(usuario.getId());
        if (roleNames.isEmpty() && usuario.getRole() != null) {
            roleNames = List.of(usuario.getRole());
        }

        return new AuthUserResponse(usuario.getUsername(), roleNames);
    }
}
