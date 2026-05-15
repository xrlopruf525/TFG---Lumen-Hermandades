# 📊 ANÁLISIS COMPLETO DE ARQUITECTURA: GESTIÓN DE USUARIOS Y ROLES
**Lumen Hermandades - TFG 2025/2026**

---

## ⚠️ PROBLEMA ACTUAL IDENTIFICADO

### Estado Actual (❌ INCORRECTO)
```
USUARIO → String "role" (campo directo, hardcodeado como texto)
          ↓
         "ADMIN" | "HERMANO" (valores hardcodeados)
          ↓
         Spring Security obtiene rol desde este campo
         Auth Service devuelve rol como String en LoginResponse
```

### Impacto del Problema
1. **Escalabilidad**: Cada nuevo rol requiere cambios en código
2. **Base de datos**: No hay tabla intermedia, rol está embebido en Usuario
3. **Spring Security**: Confía en un String hardcodeado sin relación con tabla Rol
4. **Múltiples roles**: Sistema NO soporta un usuario con múltiples roles
5. **Flexibilidad**: Cambios de permisos requieren migración de BD + código

---

## 📋 ANÁLISIS DETALLADO POR COMPONENTE

### 1. BACKEND - ENTIDADES JPA

#### ❌ Entidad Usuario (ACTUAL - INCORRECTA)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/modules/usuario/entity/Usuario.java`

```java
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
    private String role;  // ⚠️ PROBLEMA: String hardcodeado
    
    // getters/setters
}
```

**Problemas**:
- No hay relación JPA con tabla Rol
- Campo rol es String plano
- No permite múltiples roles por usuario
- Imposible tener auditoría de cambios de rol (fecha de asignación, etc.)

---

#### ✅ Entidad Rol (EXISTE - CORRECTA)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/modules/rol/entity/Rol.java`

```java
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
}
```

**Estado**: Entidad independiente pero NO relacionada con Usuario

---

### 2. BACKEND - SPRING SECURITY & JWT

#### ❌ CustomUserDetailsService (ACTUAL - INCORRECTA)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/auth/security/CustomUserDetailsService.java`

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        // ⚠️ PROBLEMA: Lee rol directamente como String
        return new User(
            usuario.getUsername(), 
            usuario.getPassword(), 
            List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRole()))
        );
    }
}
```

**Problemas**:
- Spring Security solo carga UN rol (lista con un único elemento)
- No hay relación con tabla de Roles
- El rol es un String que se prefija con "ROLE_" arbitrariamente
- No valida que el rol exista en tabla Rol

---

#### ❌ AuthServiceImpl (ACTUAL - DEVUELVE ROL DIRECTO)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/auth/services/impl/AuthServiceImpl.java`

```java
public LoginResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
    );
    Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    
    // ⚠️ PROBLEMA: Devuelve rol como String
    return new LoginResponse(
        jwtService.generateToken(usuario.getUsername()), 
        "Bearer", 
        usuario.getUsername(), 
        usuario.getRole()  // ← String directo
    );
}
```

**Impacto**:
- Frontend recibe rol como String único
- No hay información sobre permisos
- No hay lista de roles si usuario tiene múltiples

---

#### ⚠️ JwtService (LIMITADO)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/auth/services/JwtService.java`

```java
public String generateToken(String username) {
    return Jwts.builder()
        .subject(username)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(getSigningKey())
        .compact();
}
```

**Observación**:
- No incluye rol en claims del JWT
- Solo contiene username
- Rol debe consultarse en cada petición autenticada (ineficiente)

---

#### ⚠️ SecurityConfig (CORRECTO pero INCOMPLETO)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/common/config/SecurityConfig.java`

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    // @PreAuthorize("hasRole('ADMIN')") funciona pero:
    // - Solo soporta un rol por usuario
    // - Depende del String hardcodeado en Usuario.role
}
```

---

### 3. BACKEND - DTOs DE AUTENTICACIÓN

#### ❌ LoginResponse DTO
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/auth/dto/LoginResponse.java`

```java
public class LoginResponse {
    private String token;
    private String type;
    private String username;
    private String role;  // ← String único, no lista
}
```

**Problemas**:
- Solo soporta un rol como String
- No hay información de permisos
- No hay lista de roles para múltiples asignaciones

---

#### ❌ AuthUserResponse DTO
```java
public class AuthUserResponse {
    private String username;
    private String role;  // ← Mismo problema
}
```

---

### 4. BACKEND - INICIALIZACIÓN DE DATOS

#### ❌ DataInitializer (HARDCODEADO)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/common/config/DataInitializer.java`

```java
CommandLineRunner initUsuarios(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
    return args -> {
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");  // ⚠️ HARDCODEADO como String
            usuarioRepository.save(admin);
        }
    };
}
```

---

#### ❌ HermanoServiceImpl (ASIGNA ROL HARDCODEADO)
**Ubicación**: `lumen-backend/src/main/java/es/lumen/lumen_backend/modules/hermano/service/impl/HermanoServiceImpl.java`

```java
// En algún método de creación de hermano:
usuario.setRole("HERMANO");  // ⚠️ String hardcodeado
```

---

### 5. FRONTEND - ANGULAR

#### ⚠️ AuthService (MANEJA ROL COMO STRING)
**Ubicación**: `lumen-frontend/src/app/core/services/auth.service.ts`

```typescript
interface LoginResponsePayload {
    token?: string;
    username?: string;
    role?: string;  // ← String único
}

export interface AuthUser {
    username: string;
    role: string;  // ← String único, no array
}

login(credentials: LoginCredentials): Observable<string> {
    // ...
    const role = this.extractRole(response) ?? 'ADMIN';
    localStorage.setItem(this.authUserKey, JSON.stringify({ username, role }));
}
```

**Problemas**:
- Almacena rol como String en localStorage
- No hay soporte para múltiples roles
- No hay sincronización de permisos desde backend

---

#### ⚠️ AuthGuard (SOLO VALIDA UN ROL)
**Ubicación**: `lumen-frontend/src/app/core/guards/auth.guard.ts`

```typescript
private checkAccess(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRole = route.data['role'] as string | undefined;
    if (!expectedRole) return true;
    
    const user = this.authService.getUser();
    // ⚠️ Comparación 1-a-1, no soporta múltiples roles
    if (user?.role === expectedRole) {
        return true;
    }
    
    return this.router.createUrlTree([user?.role === 'HERMANO' ? '/portal-hermano' : '/dashboard']);
}
```

---

### 6. DATABASE - ESTRUCTURA ACTUAL

#### Tabla Usuarios (ACTUAL)
```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL  -- ⚠️ PROBLEMA: role como String directo
);
```

#### Tabla Roles (EXISTE pero NO RELACIONADA)
```sql
CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL,
    permisos TEXT,
    deleted BOOLEAN DEFAULT FALSE
);
```

#### ⚠️ NO EXISTE: Tabla Intermedia Usuario_Rol
```sql
-- FALTA CREAR:
CREATE TABLE usuario_rol (
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE
);
```

---

### 7. PATRÓN EXITOSO YA IMPLEMENTADO EN EL PROYECTO

El proyecto **YA TIENE** un patrón correcto de tablas intermedias:

#### ✅ Relación HermanoGrupo (MODELO A SEGUIR)
```java
@Entity
@Table(name = "hermano_grupo")
public class HermanoGrupo {
    @EmbeddedId
    private HermanoGrupoId id;
    
    @Column(name = "fecha_incorporacion")
    private LocalDate fechaIncorporacion;
    
    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;
}

@Embeddable
public class HermanoGrupoId implements Serializable {
    @Column(name = "id_hermano")
    private Integer idHermano;
    
    @Column(name = "id_grupo")
    private Integer idGrupo;
    
    // constructor, getters, equals, hashCode
}
```

**Ventajas de este patrón**:
- ✅ Soporta múltiples relaciones por usuario
- ✅ Permite auditoría de fechas
- ✅ Fácil soft-delete con flag
- ✅ Escalable y flexible

---

## 🔴 IMPACTO DE CAMBIOS NECESARIOS

### Archivos que NECESITARÁN CAMBIOS

#### BACKEND (Java/Spring Boot):
1. **Entidades**:
   - ❌ `Usuario.java` - Eliminar campo `role` String, añadir relación @OneToMany
   - ✅ `Rol.java` - Mantener, posiblemente añadir @OneToMany
   - 🆕 `UsuarioRol.java` - CREAR entidad intermedia
   - 🆕 `UsuarioRolId.java` - CREAR clase @Embeddable con clave primaria compuesta

2. **Seguridad**:
   - ❌ `CustomUserDetailsService.java` - Refactorizar para leer roles desde UsuarioRol
   - ❌ `AuthServiceImpl.java` - Cambiar LoginResponse para devolver lista de roles
   - ⚠️ `JwtService.java` - Considerar incluir roles en claims del JWT
   - ⚠️ `SecurityConfig.java` - Posiblemente ajustar para múltiples roles

3. **DTOs**:
   - ❌ `LoginResponse.java` - Cambiar `String role` por `List<String> roles`
   - ❌ `AuthUserResponse.java` - Cambiar `String role` por `List<String> roles`
   - 🆕 `UsuarioRolDTO.java` - CREAR si es necesario

4. **Repositories**:
   - 🆕 `UsuarioRolRepository.java` - CREAR para tabla intermedia

5. **Services**:
   - ⚠️ `HermanoServiceImpl.java` - Cambiar asignación de rol (de String a relación)

6. **Inicialización**:
   - ❌ `DataInitializer.java` - Cambiar para crear relaciones en lugar de strings

7. **Base de Datos**:
   - 🆕 `usuario_rol_migration.sql` - CREAR script de migración

#### FRONTEND (Angular/TypeScript):
1. **Interfaces**:
   - ❌ `auth.service.ts` - Cambiar `role: string` por `roles: string[]`
   
2. **Guards**:
   - ❌ `auth.guard.ts` - Refactorizar para verificar múltiples roles

3. **Storage**:
   - ⚠️ localStorage - Necesitará actualización para guardar array de roles

---

## ✅ ESTRATEGIA DE MIGRACIÓN RECOMENDADA

### FASE 1: Preparación (ANÁLISIS - ✅ COMPLETADO)
- [x] Identificar componentes afectados
- [x] Documentar estado actual
- [x] Planificar cambios

### FASE 2: Backend - Entidades (SIN RUPTURA)
1. Crear `UsuarioRol.java` y `UsuarioRolId.java`
2. Crear `UsuarioRolRepository.java`
3. Crear migration SQL
4. Mantener campo `role` en Usuario (compatibilidad hacia atrás)

### FASE 3: Backend - Seguridad
1. Refactorizar `CustomUserDetailsService.loadUserByUsername()`
2. Cambiar `AuthServiceImpl.login()` para devolver `List<String> roles`
3. Actualizar DTOs (`LoginResponse`, `AuthUserResponse`)
4. Opcionalmente: Incluir roles en JWT claims

### FASE 4: Backend - Inicialización
1. Actualizar `DataInitializer` para crear relaciones
2. Migrar hermanos existentes a tabla `usuario_rol`

### FASE 5: Frontend - Angular
1. Actualizar interfaces en `auth.service.ts`
2. Refactorizar `auth.guard.ts` para soportar múltiples roles
3. Actualizar localStorage para guardar array de roles

### FASE 6: Testing & Validación
1. Probar login con diferentes roles
2. Verificar guards con múltiples roles
3. Validar JWT token contiene roles

---

## ⚠️ RIESGOS Y CONSIDERACIONES

### Riesgos Identificados:
1. **Rompimiento de autenticación actual**: Si no se maneja bien la migración
2. **Datos existentes**: Usuarios actuales tienen rol como String
3. **Compatibilidad**: Frontend/Backend desincronizados durante transición

### Mitigation:
- Mantener campo `role` durante transición (compatibilidad)
- Crear script de migración de datos cuidadoso
- Testing exhaustivo antes de eliminar campo role

### Puntos Críticos NO ROMPER:
- ✅ JWT debe seguir funcionando
- ✅ Login existente debe seguir funcionando
- ✅ Auth guards deben seguir funcionando
- ✅ Spring Security debe seguir funcionando

---

## 🎯 RESULTADO ESPERADO FINAL

### Arquitectura Correcta (✅ OBJETIVO)
```
USUARIO --[1:N]--> USUARIO_ROL --[N:1]--> ROL
                   (tabla intermedia)
         
Beneficios:
✅ Un usuario puede tener múltiples roles
✅ Auditoría de fechas de asignación
✅ Soft-delete con flag
✅ Spring Security lee desde tabla
✅ Escalable y profesional
✅ Mantiene patrón del proyecto (HermanoGrupo)
```

---

## 📝 RESUMEN EJECUTIVO

| Aspecto | Actual | Objetivo | Impacto |
|---------|--------|----------|--------|
| Roles por Usuario | 1 (String) | N (List) | ALTO |
| Tabla Intermedia | ❌ No | ✅ Sí | ALTO |
| Spring Security | ⚠️ Básico | ✅ Profesional | MEDIO |
| JWT Claims | ❌ Solo username | ✅ Incluye roles | BAJO |
| Múltiples Roles | ❌ No | ✅ Sí | ALTO |
| Auditoría Cambios | ❌ No | ✅ Sí (fecha) | BAJO |
| Rompimiento Auth | - | ❌ Evitar | CRÍTICO |

---

**Documento generado**: Mayo 2026
**Estado**: ANÁLISIS COMPLETADO - LISTO PARA REFACTORIZACIÓN
