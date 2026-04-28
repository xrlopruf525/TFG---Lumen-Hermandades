package es.lumen.lumen_backend.hermano_modulo.controllers;

import es.lumen.lumen_backend.hermano_modulo.dto.HermanoDto;
import es.lumen.lumen_backend.hermano_modulo.dto.PortalHermanoDto;
import es.lumen.lumen_backend.hermano_modulo.models.Hermano;
import es.lumen.lumen_backend.hermano_modulo.services.HermanoService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/hermanos")
@CrossOrigin(origins = "http://localhost:4200")
public class HermanoController {

    private final HermanoService hermanoService;

    public HermanoController(HermanoService hermanoService) {
        this.hermanoService = hermanoService;
    }

    @GetMapping
    public List<Hermano> listarActivos() {
        return hermanoService.buscarTodosActivos();
    }

    @GetMapping("/buscar")
    public List<Hermano> buscarHermanos() {
        return hermanoService.buscarTodosActivos();
    }

    @GetMapping("/inactivos")
    public List<Hermano> listarInactivos() {
        return hermanoService.buscarInactivos();
    }

    @GetMapping("/{id}")
    public Hermano obtenerPorId(@PathVariable Long id) {
        return hermanoService.buscarPorId(id);
    }

    @PostMapping
    public Hermano altaHermano(@RequestBody HermanoDto dto) {
        return hermanoService.guardar(dto);
    }

    @PostMapping("/guardar")
    public Hermano guardarHermano(@RequestBody HermanoDto dto) {
        if (dto.getId() != null) {
            return hermanoService.actualizar(dto.getId(), dto);
        }

        return hermanoService.guardar(dto);
    }

    @PutMapping("/{id}")
    public Hermano modificarHermano(@PathVariable Long id, @RequestBody HermanoDto dto) {
        return hermanoService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarHermano(@PathVariable Long id) {
        hermanoService.bajaLogica(id);
    }

    @PatchMapping("/{id}/baja-logica")
    public void bajaLogica(@PathVariable Long id) {
        hermanoService.bajaLogica(id);
    }

    @GetMapping("/me")
    public PortalHermanoDto obtenerMiPerfil(Principal principal) {
        return hermanoService.obtenerDatosPortalPorEmail(principal.getName());
    }
}