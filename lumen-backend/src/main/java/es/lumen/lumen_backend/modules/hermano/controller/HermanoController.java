package es.lumen.lumen_backend.modules.hermano.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.HermanoRequest;
import es.lumen.lumen_backend.modules.hermano.dto.ImportarHermanosResponse;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.service.HermanoService;

@RestController
@RequestMapping("/hermanos")
@PreAuthorize("hasRole('ADMIN')")
public class HermanoController {

    private final HermanoService hermanoService;

    public HermanoController(HermanoService hermanoService) {
        this.hermanoService = hermanoService;
    }

    @GetMapping
    public List<HermanoDto> listarActivos() {
        return hermanoService.buscarTodosActivos();
    }

    @GetMapping("/inactivos")
    public List<HermanoDto> listarInactivos() {
        return hermanoService.buscarInactivos();
    }

    @GetMapping("/buscar")
    public List<HermanoDto> buscar(@RequestParam(name = "q") String query) {
        return hermanoService.buscarActivosPorTexto(query);
    }

    @GetMapping("/{id}")
    public HermanoDto obtenerPorId(@PathVariable Integer id) {
        return hermanoService.buscarPorId(id);
    }

    @PostMapping
    public HermanoDto altaHermano(@Valid @RequestBody HermanoRequest request) {
        return hermanoService.guardar(request);
    }

    @PostMapping("/importar")
    public ImportarHermanosResponse importarHermanos(@Valid @RequestBody List<@Valid HermanoRequest> hermanos) {
        return hermanoService.importarHermanos(hermanos);
    }

    @PutMapping("/{id}")
    public HermanoDto modificarHermano(@PathVariable Integer id, @Valid @RequestBody HermanoRequest request) {
        return hermanoService.actualizar(id, request);
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
