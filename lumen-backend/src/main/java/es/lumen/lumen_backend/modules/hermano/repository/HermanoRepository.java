package es.lumen.lumen_backend.modules.hermano.repository;

import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HermanoRepository extends JpaRepository<Hermano, Integer> {

    List<Hermano> findByDeletedFalse();

    List<Hermano> findByDeletedTrue();

    Optional<Hermano> findByUsuario(Usuario usuario);

    @Query(value = "SELECT COUNT(*) FROM hermano_grupo WHERE id_grupo = :idGrupo", nativeQuery = true)
    Long contarHermanosPorGrupo(@Param("idGrupo") Integer idGrupo);
}