package es.lumen.lumen_backend.hermano_modulo.repositories;

import es.lumen.lumen_backend.hermano_modulo.models.Hermano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HermanoRepository extends JpaRepository<Hermano, Long> {
    @Query("SELECT h FROM Hermano h WHERE h.nombre LIKE %:query% OR h.apellidos LIKE %:query%")
    List<Hermano> buscarPorNombreOApellidos(@Param("query") String query);
}