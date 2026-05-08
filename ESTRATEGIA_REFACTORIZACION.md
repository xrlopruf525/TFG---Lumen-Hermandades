# 🔧 ESTRATEGIA DE REFACTORIZACIÓN: USUARIOS Y ROLES
**Lumen Hermandades - Plan de Migración Detallado**

---

## 📋 TABLA DE CONTENIDOS
1. [Orden de Ejecución](#orden-de-ejecución)
2. [Cambios Backend](#cambios-backend)
3. [Cambios Frontend](#cambios-frontend)
4. [Testing y Validación](#testing-y-validación)
5. [Rollback Plan](#rollback-plan)

---

## ⏰ ORDEN DE EJECUCIÓN

**IMPORTANTE**: Este orden es crítico para no romper autenticación.

```
FASE 1: Base de Datos (SQL)
  ├─ 1.1 Crear tabla usuario_rol
  ├─ 1.2 Migrar datos existentes (crear relaciones)
  └─ 1.3 Validar datos

FASE 2: Backend - Entidades JPA
  ├─ 2.1 Crear UsuarioRolId.java
  ├─ 2.2 Crear UsuarioRol.java
  ├─ 2.3 Actualizar Usuario.java (MANTENER role para compatibilidad)
  ├─ 2.4 Actualizar Rol.java (añadir @OneToMany)
  └─ 2.5 Compilar y validar

FASE 3: Backend - Repository
  ├─ 3.1 Crear UsuarioRolRepository.java
  └─ 3.2 Compilar y validar

FASE 4: Backend - Security & Auth
  ├─ 4.1 Actualizar CustomUserDetailsService.java
  ├─ 4.2 Actualizar DTOs (LoginResponse, AuthUserResponse)
  ├─ 4.3 Actualizar AuthServiceImpl.java
  ├─ 4.4 Considerar JwtService.java (incluir roles)
  └─ 4.5 Compilar y validar

FASE 5: Backend - Servicios
  ├─ 5.1 Actualizar HermanoServiceImpl.java
  ├─ 5.2 Actualizar DataInitializer.java
  └─ 5.3 Compilar y validar

FASE 6: Frontend - Angular
  ├─ 6.1 Actualizar AuthService (interfaces)
  ├─ 6.2 Actualizar AuthGuard.ts
  ├─ 6.3 Actualizar componentes que usen rol
  └─ 6.4 Compilar y validar

FASE 7: Testing
  ├─ 7.1 Test login básico
  ├─ 7.2 Test múltiples roles
  ├─ 7.3 Test guards
  ├─ 7.4 Test JWT
  └─ 7.5 Validar datos en BD
```

---

## 🔧 CAMBIOS BACKEND

### FASE 1: BASE DE DATOS

#### 1.1 - Crear tabla usuario_rol

**Archivo**: `lumen-backend/src/main/resources/sql/usuario_rol_migration.sql`

```sql
-- Crear tabla intermedia usuario_rol
CREATE TABLE IF NOT EXISTS usuario_rol (
    id_usuario BIGINT NOT NULL,
    id_rol INT NOT NULL,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
    INDEX idx_usuario_rol_usuario (id_usuario),
    INDEX idx_usuario_rol_rol (id_rol)
);

-- Migrar usuarios existentes con rol "ADMIN"
INSERT INTO usuario_rol (id_usuario, id_rol, fecha_asignacion)
SELECT u.id, r.id_rol, NOW()
FROM usuarios u
LEFT JOIN rol r ON r.nombre_rol = UPPER(u.role)
WHERE u.role = 'ADMIN' AND u.id NOT IN (
    SELECT id_usuario FROM usuario_rol WHERE id_rol = r.id_rol
);

-- Migrar usuarios existentes con rol "HERMANO"
INSERT INTO usuario_rol (id_usuario, id_rol, fecha_asignacion)
SELECT u.id, r.id_rol, NOW()
FROM usuarios u
LEFT JOIN rol r ON r.nombre_rol = UPPER(u.role)
WHERE u.role = 'HERMANO' AND u.id NOT IN (
    SELECT id_usuario FROM usuario_rol WHERE id_rol = r.id_rol
);

-- Validar migración
SELECT COUNT(*) as total_relaciones FROM usuario_rol;
```

---

### FASE 2: ENTIDADES JPA

#### 2.1 - Crear UsuarioRolId.java

**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/modules/usuario/entity/UsuarioRolId.java`

```java
package es.lumen.lumen_backend.modules.usuario.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UsuarioRolId implements Serializable {

    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "id_rol")
    private Integer idRol;

    public UsuarioRolId() {}

    public UsuarioRolId(Long idUsuario, Integer idRol) {
        this.idUsuario = idUsuario;
        this.idRol = idRol;
    }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdRol() { return idRol; }
    public void setIdRol(Integer idRol) { this.idRol = idRol; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioRolId that = (UsuarioRolId) o;
        return Objects.equals(idUsuario, that.idUsuario) && 
               Objects.equals(idRol, that.idRol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, idRol);
    }
}
```

---

#### 2.2 - Crear UsuarioRol.java

**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/modules/usuario/entity/UsuarioRol.java`

```java
package es.lumen.lumen_backend.modules.usuario.entity;

import jakarta.persistence.*;
import es.lumen.lumen_backend.modules.rol.entity.Rol;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_rol")
public class UsuarioRol {

    @EmbeddedId
    private UsuarioRolId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", insertable = false, updatable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol", insertable = false, updatable = false)
    private Rol rol;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDateTime fechaAsignacion;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    public UsuarioRol() {}

    public UsuarioRol(UsuarioRolId id, LocalDateTime fechaAsignacion) {
        this.id = id;
        this.fechaAsignacion = fechaAsignacion;
        this.deleted = false;
    }

    // Getters y Setters
    public UsuarioRolId getId() { return id; }
    public void setId(UsuarioRolId id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public LocalDateTime getFechaAsignacion() { return fechaAsignacion; }
    public void setFechaAsignacion(LocalDateTime fechaAsignacion) { 
        this.fechaAsignacion = fechaAsignacion; 
    }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
```

---

#### 2.3 - Actualizar Usuario.java (MANTENER role para compatibilidad)

**CAMBIO CLAVE**: Añadir relación @OneToMany, PERO MANTENER campo role String

```java
package es.lumen.lumen_backend.modules.usuario.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

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
    private String role;  // ⚠️ MANTENER para compatibilidad (FASE de transición)

    // ✅ NUEVO: Relación con tabla intermedia
    @OneToMany(mappedBy = "usuario", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UsuarioRol> usuarioRoles = new HashSet<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Set<UsuarioRol> getUsuarioRoles() { return usuarioRoles; }
    public void setUsuarioRoles(Set<UsuarioRol> usuarioRoles) { 
        this.usuarioRoles = usuarioRoles; 
    }

    // ✅ NUEVO: Helper method para obtener lista de nombres de roles
    public Set<String> getRoleNames() {
        Set<String> roleNames = new HashSet<>();
        for (UsuarioRol ur : usuarioRoles) {
            if (!ur.getDeleted() && ur.getRol() != null) {
                roleNames.add(ur.getRol().getNombreRol());
            }
        }
        return roleNames;
    }

    // ✅ NUEVO: Helper method para asignar rol
    public void addRole(Rol rol) {
        UsuarioRol usuarioRol = new UsuarioRol();
        usuarioRol.setId(new UsuarioRolId(this.id, rol.getId()));
        usuarioRol.setUsuario(this);
        usuarioRol.setRol(rol);
        usuarioRol.setFechaAsignacion(java.time.LocalDateTime.now());
        this.usuarioRoles.add(usuarioRol);
    }
}
```

---

#### 2.4 - Actualizar Rol.java

```java
package es.lumen.lumen_backend.modules.rol.entity;

import jakarta.persistence.*;
import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRol;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer id;

    @Column(name = "nombre_rol", nullable = false, length = 100)
    private String nombreRol;

    @Column(name = "permisos", columnDefinition = "TEXT")
    private String permisos;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    // ✅ NUEVO: Relación con tabla intermedia
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<UsuarioRol> usuarioRoles = new HashSet<>();

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreRol() { return nombreRol; }
    public void setNombreRol(String nombreRol) { this.nombreRol = nombreRol; }

    public String getPermisos() { return permisos; }
    public void setPermisos(String permisos) { this.permisos = permisos; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    public Set<UsuarioRol> getUsuarioRoles() { return usuarioRoles; }
    public void setUsuarioRoles(Set<UsuarioRol> usuarioRoles) { 
        this.usuarioRoles = usuarioRoles; 
    }
}
```

---

### FASE 3: REPOSITORY

#### 3.1 - Crear UsuarioRolRepository.java

**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/modules/usuario/repository/UsuarioRolRepository.java`

```java
package es.lumen.lumen_backend.modules.usuario.repository;

import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRol;
import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRolId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, UsuarioRolId> {

    @Query("SELECT ur FROM UsuarioRol ur WHERE ur.usuario.id = :usuarioId AND ur.deleted = false")
    List<UsuarioRol> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT ur FROM UsuarioRol ur WHERE ur.usuario.id = :usuarioId AND ur.deleted = false")
    Set<UsuarioRol> findRolesByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT ur.rol.nombreRol FROM UsuarioRol ur WHERE ur.usuario.id = :usuarioId AND ur.deleted = false")
    List<String> findRoleNamesByUsuarioId(@Param("usuarioId") Long usuarioId);

    boolean existsByIdAndDeletedFalse(UsuarioRolId id);
}
```

---

### FASE 4: SECURITY & AUTH

#### 4.1 - Refactorizar CustomUserDetailsService.java

```java
package es.lumen.lumen_backend.auth.security;

import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRolRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;

    public CustomUserDetailsService(
            UsuarioRepository usuarioRepository,
            UsuarioRolRepository usuarioRolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioRolRepository = usuarioRolRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // ✅ NUEVO: Obtener lista de roles desde tabla intermedia
        List<String> roleNames = usuarioRolRepository.findRoleNamesByUsuarioId(usuario.getId());

        // Si no hay roles en tabla intermedia, usar el campo role para compatibilidad
        if (roleNames.isEmpty() && usuario.getRole() != null) {
            roleNames = List.of(usuario.getRole());
        }

        // Convertir a authorities de Spring Security
        List<SimpleGrantedAuthority> authorities = roleNames.stream()
                .map(roleName -> new SimpleGrantedAuthority("ROLE_" + roleName))
                .collect(Collectors.toList());

        return new User(
                usuario.getUsername(),
                usuario.getPassword(),
                authorities
        );
    }
}
```

---

#### 4.2 - Actualizar DTOs

**LoginResponse.java**:
```java
package es.lumen.lumen_backend.auth.dto;

import java.util.List;

public class LoginResponse {
    private String token;
    private String type;
    private String username;
    private List<String> roles;  // ✅ CAMBIO: De String a List<String>

    public LoginResponse() {}

    public LoginResponse(String token, String type, String username, List<String> roles) {
        this.token = token;
        this.type = type;
        this.username = username;
        this.roles = roles;
    }

    // Getters y Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
```

**AuthUserResponse.java**:
```java
package es.lumen.lumen_backend.auth.dto;

import java.util.List;

public class AuthUserResponse {
    private String username;
    private List<String> roles;  // ✅ CAMBIO: De String a List<String>

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
```

---

#### 4.3 - Actualizar AuthServiceImpl.java

```java
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

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            UsuarioRolRepository usuarioRolRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.usuarioRolRepository = usuarioRolRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // ✅ NUEVO: Obtener lista de roles desde tabla intermedia
        List<String> roleNames = usuarioRolRepository.findRoleNamesByUsuarioId(usuario.getId());

        // Compatibilidad: si no hay roles en tabla intermedia, usar el campo role
        if (roleNames.isEmpty() && usuario.getRole() != null) {
            roleNames = List.of(usuario.getRole());
        }

        // ✅ NUEVO: Devolver lista de roles
        return new LoginResponse(
                jwtService.generateToken(usuario.getUsername()),
                "Bearer",
                usuario.getUsername(),
                roleNames
        );
    }

    @Override
    public AuthUserResponse me(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // ✅ NUEVO: Obtener lista de roles
        List<String> roleNames = usuarioRolRepository.findRoleNamesByUsuarioId(usuario.getId());

        // Compatibilidad
        if (roleNames.isEmpty() && usuario.getRole() != null) {
            roleNames = List.of(usuario.getRole());
        }

        return new AuthUserResponse(usuario.getUsername(), roleNames);
    }
}
```

---

#### 4.4 - Considerar actualizar JwtService.java (OPCIONAL)

```java
// OPCIONAL: Incluir roles en JWT para mejorar performance
public String generateToken(String username, List<String> roles) {
    return Jwts.builder()
            .subject(username)
            .claim("roles", roles)  // ✅ NUEVO: Incluir roles en JWT
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(getSigningKey())
            .compact();
}

// Método para extraer roles del JWT
public List<String> extractRoles(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    return (List<String>) claims.get("roles");
}
```

---

### FASE 5: SERVICIOS

#### 5.1 - Actualizar HermanoServiceImpl.java

```java
// En el método de creación de hermano/usuario:
Usuario usuario = new Usuario();
usuario.setUsername(...);
usuario.setPassword(...);
usuario.setRole("HERMANO");  // ⚠️ MANTENER para compatibilidad

// ✅ NUEVO: Crear relación en tabla intermedia
Rol rolHermano = rolRepository.findByNombreRol("HERMANO")
    .orElseThrow(() -> new RuntimeException("Rol HERMANO no encontrado"));
usuario.addRole(rolHermano);

usuarioRepository.save(usuario);
```

---

#### 5.2 - Actualizar DataInitializer.java

```java
@Bean
CommandLineRunner initData(
        UsuarioRepository usuarioRepository,
        RolRepository rolRepository,
        UsuarioRolRepository usuarioRolRepository,
        PasswordEncoder passwordEncoder) {
    return args -> {
        // Crear roles si no existen
        Rol rolAdmin = rolRepository.findByNombreRol("ADMIN")
                .orElseGet(() -> {
                    Rol newRol = new Rol();
                    newRol.setNombreRol("ADMIN");
                    newRol.setPermisos("all");
                    return rolRepository.save(newRol);
                });

        Rol rolHermano = rolRepository.findByNombreRol("HERMANO")
                .orElseGet(() -> {
                    Rol newRol = new Rol();
                    newRol.setNombreRol("HERMANO");
                    newRol.setPermisos("read,comment");
                    return rolRepository.save(newRol);
                });

        // Crear usuario admin
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");  // ✅ MANTENER para compatibilidad

            // ✅ NUEVO: Crear relación
            admin.addRole(rolAdmin);

            usuarioRepository.save(admin);
        }
    };
}
```

---

## 🎨 CAMBIOS FRONTEND

### FASE 6: ANGULAR

#### 6.1 - Actualizar auth.service.ts

```typescript
// Actualizar interfaces
interface LoginResponsePayload {
    token?: string;
    type?: string;
    username?: string;
    roles?: string[];  // ✅ CAMBIO: De string a string[]
}

export interface AuthUser {
    username: string;
    roles: string[];  // ✅ CAMBIO: De string a string[]
}

// Método login actualizado
login(credentials: LoginCredentials): Observable<string> {
    // ...
    const roles = this.extractRoles(response) ?? ['USER'];
    localStorage.setItem(this.authUserKey, JSON.stringify({ username, roles }));
    // ...
}

// ✅ NUEVO: Método helper para validar rol
hasRole(requiredRole: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(requiredRole) ?? false;
}

// ✅ NUEVO: Método helper para validar múltiples roles
hasAnyRole(requiredRoles: string[]): boolean {
    const user = this.getUser();
    return requiredRoles.some(role => user?.roles?.includes(role)) ?? false;
}
```

---

#### 6.2 - Actualizar auth.guard.ts

```typescript
private checkAccess(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
        return this.router.createUrlTree(['/login']);
    }

    const expectedRoles = route.data['roles'] as string[] | undefined;
    if (!expectedRoles || expectedRoles.length === 0) {
        return true;
    }

    // ✅ CAMBIO: Soportar múltiples roles
    const user = this.authService.getUser();
    if (user && this.authService.hasAnyRole(expectedRoles)) {
        return true;
    }

    // Redirect basado en roles disponibles
    const redirectPath = user?.roles?.includes('HERMANO') ? '/portal-hermano' : '/dashboard';
    return this.router.createUrlTree([redirectPath]);
}
```

---

## ✅ TESTING Y VALIDACIÓN

### Casos de Prueba Críticos:

```
TEST 1: Login básico
  ├─ Usuario admin con 1 rol
  └─ Verificar response contiene roles como array

TEST 2: Múltiples roles
  ├─ Usuario con 2+ roles
  └─ Verificar todos los roles en response

TEST 3: Guards
  ├─ Acceso a ruta protegida por rol
  ├─ Acceso denegado con rol incorrecto
  └─ Acceso permitido con múltiples roles

TEST 4: Base de datos
  ├─ Tabla usuario_rol creada
  ├─ Relaciones migradas correctamente
  └─ Soft-delete funciona

TEST 5: JWT
  ├─ Token generado correctamente
  ├─ Claims incluyen roles (si se implementa)
  └─ Token válido en requests autenticados

TEST 6: Compatibilidad hacia atrás
  ├─ Usuarios sin relaciones usan campo role
  └─ Sistema funciona en transición
```

---

## 🔄 ROLLBACK PLAN

Si algo falla:

```sql
-- Rollback: Eliminar tabla usuario_rol
DROP TABLE IF EXISTS usuario_rol;

-- Restaurar aplicación a version anterior
git revert <commit-hash>

-- Revertir código backend/frontend
```

---

## 📊 CHECKLIST FINAL

- [ ] SQL migration creada y probada
- [ ] UsuarioRolId.java creada
- [ ] UsuarioRol.java creada
- [ ] Usuario.java actualizada (con relación)
- [ ] Rol.java actualizada (con relación)
- [ ] UsuarioRolRepository.java creada
- [ ] CustomUserDetailsService.java actualizada
- [ ] DTOs actualizados (LoginResponse, AuthUserResponse)
- [ ] AuthServiceImpl.java actualizada
- [ ] HermanoServiceImpl.java actualizada
- [ ] DataInitializer.java actualizada
- [ ] auth.service.ts actualizada (interfaces + métodos)
- [ ] auth.guard.ts actualizada (múltiples roles)
- [ ] Backend compila sin errores
- [ ] Frontend compila sin errores
- [ ] Tests pasan
- [ ] Login funciona
- [ ] Guards funcionan
- [ ] Multiple roles pueden asignarse

---

**Documento generado**: Mayo 2026
**Estado**: LISTO PARA IMPLEMENTACIÓN
