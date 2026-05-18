package es.lumen.lumen_backend.common.config;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.lumen.lumen_backend.modules.rol.entity.Rol;
import es.lumen.lumen_backend.modules.rol.repository.RolRepository;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRol;
import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRolId;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRolRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initUsuarios(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            UsuarioRolRepository usuarioRolRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Ensure roles exist
            Rol rolAdmin = rolRepository.findAll().stream().filter(r -> "ADMIN".equalsIgnoreCase(r.getNombreRol())).findFirst()
                    .orElseGet(() -> {
                        Rol r = new Rol();
                        r.setNombreRol("ADMIN");
                        r.setPermisos("all");
                        return rolRepository.save(r);
                    });

            // Ensure HERMANO role exists (created on-demand by other flows if not required here)
            rolRepository.findAll().stream().filter(r -> "HERMANO".equalsIgnoreCase(r.getNombreRol())).findFirst()
                    .orElseGet(() -> {
                        Rol r = new Rol();
                        r.setNombreRol("HERMANO");
                        r.setPermisos("read,comment");
                        return rolRepository.save(r);
                    });

            // Create admin user if missing
            Optional<Usuario> maybeAdmin = usuarioRepository.findByUsername("admin");
            if (maybeAdmin.isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN"); // compatibility field
                admin = usuarioRepository.save(admin);

                // Create usuario_rol relation
                UsuarioRolId urId = new UsuarioRolId(admin.getId(), rolAdmin.getId());
                if (!usuarioRolRepository.existsByIdAndDeletedFalse(urId)) {
                    UsuarioRol ur = new UsuarioRol();
                    ur.setId(urId);
                    ur.setUsuario(admin);
                    ur.setRol(rolAdmin);
                    ur.setFechaAsignacion(LocalDateTime.now());
                    ur.setDeleted(false);
                    usuarioRolRepository.save(ur);
                }
            }
        };
    }
}
