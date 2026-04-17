package es.lumen.lumen_backend.modules.rol.controller;

import es.lumen.lumen_backend.modules.rol.entity.Rol;
import es.lumen.lumen_backend.modules.rol.repository.RolRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final RolRepository rolRepository;

    public RolController(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @GetMapping
    public List<Rol> listar() {
        return rolRepository.findAll();
    }
}
