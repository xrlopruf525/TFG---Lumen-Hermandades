package es.lumen.lumen_backend.modules.grupo.controller;

import es.lumen.lumen_backend.modules.grupo.dto.CrearGrupoRequest;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoResumenDto;
import es.lumen.lumen_backend.modules.grupo.entity.Grupo;
import es.lumen.lumen_backend.modules.grupo.repository.GrupoRepository;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/grupos", "/grupos"})
public class GrupoController {

    private final GrupoRepository grupoRepository;
    private final HermanoRepository hermanoRepository;

    public GrupoController(
            GrupoRepository grupoRepository,
            HermanoRepository hermanoRepository
    ) {
        this.grupoRepository = grupoRepository;
        this.hermanoRepository = hermanoRepository;
    }

    @GetMapping
    public List<GrupoResumenDto> listar() {
        return grupoRepository.findAll()
                .stream()
                .map(grupo -> new GrupoResumenDto(
                        grupo.getId(),
                        grupo.getNombre(),
                        hermanoRepository.contarHermanosPorGrupo(grupo.getId())
                ))
                .toList();
    }

    @GetMapping("/resumen")
    public List<GrupoResumenDto> listarResumen() {
        return listar();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CrearGrupoRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre del grupo es obligatorio.");
        }

        String nombreLimpio = request.getNombre().trim();

        if (grupoRepository.existsByNombreIgnoreCase(nombreLimpio)) {
            return ResponseEntity.badRequest().body("Ya existe un grupo con ese nombre.");
        }

        Grupo grupo = new Grupo();
        grupo.setNombre(nombreLimpio);

        Grupo grupoGuardado = grupoRepository.save(grupo);

        return ResponseEntity.ok(new GrupoResumenDto(
                grupoGuardado.getId(),
                grupoGuardado.getNombre(),
                0L
        ));
    }
}