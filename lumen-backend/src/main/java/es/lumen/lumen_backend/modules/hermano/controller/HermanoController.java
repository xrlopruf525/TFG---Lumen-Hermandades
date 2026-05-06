package es.lumen.lumen_backend.modules.hermano.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.service.HermanoService;

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
