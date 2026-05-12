package es.lumen.lumen_backend.avisos.services;

import es.lumen.lumen_backend.avisos.dto.AvisoRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvisoService {

    private final JdbcTemplate jdbcTemplate;
    private final JavaMailSender mailSender;

    public AvisoService(JdbcTemplate jdbcTemplate, JavaMailSender mailSender) {
        this.jdbcTemplate = jdbcTemplate;
        this.mailSender = mailSender;
    }

    public int enviarAviso(AvisoRequest request) {
        List<String> destinatarios = obtenerDestinatarios(request);

        for (String email : destinatarios) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(request.getAsunto());
            message.setText(request.getMensaje());

            mailSender.send(message);
        }

        return destinatarios.size();
    }

    private List<String> obtenerDestinatarios(AvisoRequest request) {
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
                    SELECT h.email
                    FROM hermano h
                    INNER JOIN hermano_grupo hg ON hg.id_hermano = h.id_hermano
                    WHERE hg.id_grupo = ?
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
                    SELECT email
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