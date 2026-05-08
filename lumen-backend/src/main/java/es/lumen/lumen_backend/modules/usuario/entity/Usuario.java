package es.lumen.lumen_backend.modules.usuario.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    // ✅ NEW: Relationship with usuario_rol table (N:M with Rol)
    @OneToMany(mappedBy = "usuario", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UsuarioRol> usuarioRoles = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Set<UsuarioRol> getUsuarioRoles() {
        return usuarioRoles;
    }

    public void setUsuarioRoles(Set<UsuarioRol> usuarioRoles) {
        this.usuarioRoles = usuarioRoles;
    }

    // ✅ Helper method to get role names
    public Set<String> getRoleNames() {
        Set<String> roleNames = new HashSet<>();
        for (UsuarioRol ur : usuarioRoles) {
            if (!ur.getDeleted() && ur.getRol() != null) {
                roleNames.add(ur.getRol().getNombreRol());
            }
        }
        return roleNames;
    }

    // ✅ Helper method to add role
    public void addRole(es.lumen.lumen_backend.modules.rol.entity.Rol rol) {
        UsuarioRol usuarioRol = new UsuarioRol();
        usuarioRol.setId(new UsuarioRolId(this.id, rol.getId()));
        usuarioRol.setUsuario(this);
        usuarioRol.setRol(rol);
        usuarioRol.setFechaAsignacion(java.time.LocalDateTime.now());
        this.usuarioRoles.add(usuarioRol);
    }
}
