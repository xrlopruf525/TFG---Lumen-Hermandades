package es.lumen.lumen_backend.avisos.controllers;

import es.lumen.lumen_backend.avisos.dto.AvisoRequest;
import es.lumen.lumen_backend.avisos.services.AvisoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/avisos")
public class AvisoController {

    private final AvisoService avisoService;

    public AvisoController(AvisoService avisoService) {
        this.avisoService = avisoService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<?> enviarAviso(@Valid @RequestBody AvisoRequest request) {
        int totalEnviados = avisoService.enviarAviso(request);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Aviso enviado correctamente",
                "totalEnviados", totalEnviados
        ));
    }
}