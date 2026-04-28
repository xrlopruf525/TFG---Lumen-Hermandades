package es.lumen.lumen_backend.modules.grupo.repository;

import es.lumen.lumen_backend.modules.grupo.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrupoRepository extends JpaRepository<Grupo, Integer> {
}
