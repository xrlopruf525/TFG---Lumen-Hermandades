package es.lumen.lumen_backend.avisos.services.impl;

import es.lumen.lumen_backend.avisos.dto.AvisoRequest;
import es.lumen.lumen_backend.avisos.repository.AvisoRepository;
import es.lumen.lumen_backend.avisos.services.AvisoService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvisoServiceImpl implements AvisoService {

    private final AvisoRepository avisoRepository;
    private final JavaMailSender mailSender;

    public AvisoServiceImpl(AvisoRepository avisoRepository, JavaMailSender mailSender) {
        this.avisoRepository = avisoRepository;
        this.mailSender = mailSender;
    }

    @Override
    public int enviarAviso(AvisoRequest request) {
        List<String> destinatarios = avisoRepository.obtenerDestinatarios(request);

        for (String email : destinatarios) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(request.getAsunto());
            message.setText(request.getMensaje());

            mailSender.send(message);
        }

        return destinatarios.size();
    }
}