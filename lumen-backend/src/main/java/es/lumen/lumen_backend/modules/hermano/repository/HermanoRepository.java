package es.lumen.lumen_backend.modules.hermano.repository;

import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HermanoRepository extends JpaRepository<Hermano, Integer> {

    List<Hermano> findByDeletedFalse();

    List<Hermano> findByDeletedTrue();
}
