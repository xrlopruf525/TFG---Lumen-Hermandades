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

    Optional<Hermano> findByIdAndDeletedFalse(Integer id);

    List<Hermano> findByIdInAndDeletedFalse(List<Integer> ids);

        @Query("""
                        SELECT h
                        FROM Hermano h
                        WHERE h.deleted = false
                            AND (
                                :texto IS NULL OR :texto = '' OR
                                LOWER(h.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) OR
                                LOWER(COALESCE(h.primerApellido, '')) LIKE LOWER(CONCAT('%', :texto, '%')) OR
                                LOWER(COALESCE(h.segundoApellido, '')) LIKE LOWER(CONCAT('%', :texto, '%')) OR
                                LOWER(COALESCE(h.nif, '')) LIKE LOWER(CONCAT('%', :texto, '%')) OR
                                LOWER(COALESCE(h.email, '')) LIKE LOWER(CONCAT('%', :texto, '%'))
                            )
                        ORDER BY h.nombre ASC, h.primerApellido ASC, h.segundoApellido ASC
                        """)
        List<Hermano> buscarActivosPorTexto(@Param("texto") String texto);

    Optional<Hermano> findByUsuario(Usuario usuario);

    @Query(value = "SELECT COUNT(*) FROM hermano_grupo WHERE id_grupo = :idGrupo AND deleted = 0", nativeQuery = true)
    Long contarHermanosPorGrupo(@Param("idGrupo") Integer idGrupo);
}