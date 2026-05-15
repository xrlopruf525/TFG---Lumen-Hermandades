package es.lumen.lumen_backend.auth.security;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRolRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository, UsuarioRolRepository usuarioRolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioRolRepository = usuarioRolRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        List<String> roleNames = usuarioRolRepository.findRoleNamesByUsuarioId(usuario.getId());

        if (roleNames.isEmpty() && usuario.getRole() != null) {
            roleNames = List.of(usuario.getRole());
        }

        List<SimpleGrantedAuthority> authorities = roleNames.stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                .collect(Collectors.toList());

        return new User(usuario.getUsername(), usuario.getPassword(), authorities);
    }
}
