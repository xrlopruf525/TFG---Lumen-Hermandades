package es.lumen.lumen_backend.avisos.repository;

import es.lumen.lumen_backend.avisos.dto.AvisoRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AvisoRepository {

    private final JdbcTemplate jdbcTemplate;

    public AvisoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> obtenerDestinatarios(AvisoRequest request) {
        String tipo = request.getTipoDestinatario();

        if ("HERMANO".equalsIgnoreCase(tipo)) {
            return jdbcTemplate.queryForList(
                    """
                    SELECT email
                    FROM hermano
                    WHERE id_hermano = ?
                      AND email IS NOT NULL
                      AND email <> ''
                      AND deleted = 0
                    """,
                    String.class,
                    request.getIdHermano()
            );
        }

        if ("GRUPO".equalsIgnoreCase(tipo)) {
            return jdbcTemplate.queryForList(
                    """
                    SELECT DISTINCT h.email
                    FROM hermano h
                    INNER JOIN hermano_grupo hg ON hg.id_hermano = h.id_hermano
                    WHERE hg.id_grupo = ?
                      AND hg.deleted = 0
                      AND h.email IS NOT NULL
                      AND h.email <> ''
                      AND h.deleted = 0
                    """,
                    String.class,
                    request.getIdGrupo()
            );
        }

        if ("TODOS".equalsIgnoreCase(tipo)) {
            return jdbcTemplate.queryForList(
                    """
                    SELECT DISTINCT email
                    FROM hermano
                    WHERE email IS NOT NULL
                      AND email <> ''
                      AND deleted = 0
                    """,
                    String.class
            );
        }

        throw new IllegalArgumentException("Tipo de destinatario no válido");
    }
}