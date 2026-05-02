package es.lumen.lumen_backend.modules.hermano.controller;

import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.ImportarHermanosResponse;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.service.HermanoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hermanos")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@PreAuthorize("hasRole('ADMIN')")
public class HermanoController {

    private final HermanoService hermanoService;

    public HermanoController(HermanoService hermanoService) {
        this.hermanoService = hermanoService;
    }

    @GetMapping
    public List<Hermano> listarActivos() {
        return hermanoService.buscarTodosActivos();
    }

    @GetMapping("/inactivos")
    public List<Hermano> listarInactivos() {
        return hermanoService.buscarInactivos();
    }

    @PostMapping("/importar")
    public ResponseEntity<ImportarHermanosResponse> importarHermanos(@RequestBody List<HermanoDto> hermanos) {
        ImportarHermanosResponse response = hermanoService.importarHermanos(hermanos);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public Hermano obtenerPorId(@PathVariable Integer id) {
        return hermanoService.buscarPorId(id);
    }

    @PostMapping
    public Hermano altaHermano(@RequestBody HermanoDto dto) {
        return hermanoService.guardar(dto);
    }

    @PutMapping("/{id}")
    public Hermano modificarHermano(@PathVariable Integer id, @RequestBody HermanoDto dto) {
        return hermanoService.actualizar(id, dto);
    }

    @PatchMapping("/{id}/baja-logica")
    public void bajaLogica(@PathVariable Integer id) {
        hermanoService.bajaLogica(id);
    }

    @GetMapping("/portal/{id}")
    public PortalHermanoDto obtenerPortalHermano(@PathVariable Integer id) {
        return hermanoService.obtenerDatosPortal(id);
    }
}