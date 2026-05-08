package es.lumen.lumen_backend.modules.usuario.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRol;
import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRolId;

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
