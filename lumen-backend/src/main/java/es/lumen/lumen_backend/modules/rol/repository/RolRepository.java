package es.lumen.lumen_backend.modules.rol.repository;

import es.lumen.lumen_backend.modules.rol.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<Rol, Integer> {
}
