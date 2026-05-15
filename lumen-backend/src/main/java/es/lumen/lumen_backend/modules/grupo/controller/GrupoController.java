package es.lumen.lumen_backend.modules.grupo.controller;

import es.lumen.lumen_backend.modules.grupo.dto.ActualizarGrupoHermanosRequest;
import es.lumen.lumen_backend.modules.grupo.dto.CrearGrupoRequest;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoDetalleDto;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoResumenDto;
import es.lumen.lumen_backend.modules.grupo.service.GrupoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/grupos", "/grupos"})
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping
    public List<GrupoResumenDto> listar() {
        return grupoService.listarGrupos();
    }

    @GetMapping("/resumen")
    public List<GrupoResumenDto> listarResumen() {
        return listar();
    }

    @GetMapping("/{idGrupo}")
    public ResponseEntity<GrupoDetalleDto> obtener(@PathVariable Integer idGrupo) {
        return ResponseEntity.ok(grupoService.obtenerGrupo(idGrupo));
    }

    @PostMapping
    public ResponseEntity<GrupoDetalleDto> crear(@RequestBody CrearGrupoRequest request) {
        return ResponseEntity.ok(grupoService.crearGrupo(request));
    }

    @PutMapping("/{idGrupo}")
    public ResponseEntity<GrupoDetalleDto> actualizar(@PathVariable Integer idGrupo, @RequestBody CrearGrupoRequest request) {
        return ResponseEntity.ok(grupoService.actualizarGrupo(idGrupo, request));
    }

    @PutMapping("/{idGrupo}/hermanos")
    public ResponseEntity<GrupoDetalleDto> actualizarHermanos(
            @PathVariable Integer idGrupo,
            @RequestBody ActualizarGrupoHermanosRequest request
    ) {
        return ResponseEntity.ok(grupoService.actualizarHermanos(idGrupo, request));
    }
}