package es.lumen.lumen_backend.hermano_modulo.repositories;

import es.lumen.lumen_backend.hermano_modulo.models.Hermano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HermanoRepository extends JpaRepository<Hermano, Long> {



    List<Hermano> findByActivoTrue();

    List<Hermano> findByActivoFalse();
}