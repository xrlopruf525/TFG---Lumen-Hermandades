-- ========================================
-- MIGRATION: usuario_rol table creation
-- ========================================
-- This script creates the usuario_rol intermediate table
-- to support N:M relationship between Usuario and Rol

-- Create usuario_rol table
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

-- Migrate existing usuarios with role "ADMIN" to usuario_rol table
-- This ensures backward compatibility
INSERT INTO usuario_rol (id_usuario, id_rol, fecha_asignacion, deleted)
SELECT DISTINCT u.id, r.id_rol, NOW(), FALSE
FROM usuarios u
INNER JOIN rol r ON r.nombre_rol = UPPER(u.role)
WHERE u.role = 'ADMIN' 
  AND NOT EXISTS (
    SELECT 1 FROM usuario_rol ur 
    WHERE ur.id_usuario = u.id AND ur.id_rol = r.id_rol
  );

-- Migrate existing usuarios with role "HERMANO" to usuario_rol table
INSERT INTO usuario_rol (id_usuario, id_rol, fecha_asignacion, deleted)
SELECT DISTINCT u.id, r.id_rol, NOW(), FALSE
FROM usuarios u
INNER JOIN rol r ON r.nombre_rol = UPPER(u.role)
WHERE u.role = 'HERMANO'
  AND NOT EXISTS (
    SELECT 1 FROM usuario_rol ur 
    WHERE ur.id_usuario = u.id AND ur.id_rol = r.id_rol
  );

-- Verify migration
SELECT COUNT(*) as total_relaciones_usuario_rol FROM usuario_rol WHERE deleted = FALSE;
SELECT u.username, u.role, COUNT(ur.id_rol) as roles_count 
FROM usuarios u 
LEFT JOIN usuario_rol ur ON u.id = ur.id_usuario AND ur.deleted = FALSE
GROUP BY u.id, u.username, u.role;
