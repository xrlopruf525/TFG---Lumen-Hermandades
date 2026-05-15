package es.lumen.lumen_backend.modules.grupo.repository;

import es.lumen.lumen_backend.modules.grupo.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GrupoRepository extends JpaRepository<Grupo, Integer> {

    List<Grupo> findByDeletedFalse();

    Optional<Grupo> findByIdAndDeletedFalse(Integer id);

    boolean existsByNombreIgnoreCaseAndDeletedFalse(String nombre);
}