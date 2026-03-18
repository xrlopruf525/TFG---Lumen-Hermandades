package es.lumen.lumen_backend.hermano_modulo.controllers;

import es.lumen.lumen_backend.hermano_modulo.dto.HermanoDto;
import es.lumen.lumen_backend.hermano_modulo.models.Hermano;
import es.lumen.lumen_backend.hermano_modulo.services.HermanoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hermanos")
@CrossOrigin(origins = "http://localhost:4200")
public class HermanoController {
    @Autowired
    private HermanoService hermanoService;

    @GetMapping("/buscar")
    public List<Hermano> buscarTodos() {
        return hermanoService.buscarTodos();
    }

    @PostMapping("/guardar")
    public Hermano guardar(@RequestBody HermanoDto dto) {
        Hermano hermano = new Hermano(dto);
        return hermanoService.guardar(hermano);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        hermanoService.eliminar(id);
    }
}