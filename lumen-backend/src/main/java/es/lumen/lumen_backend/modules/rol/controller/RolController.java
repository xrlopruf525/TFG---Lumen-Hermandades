package es.lumen.lumen_backend.modules.rol.controller;

import es.lumen.lumen_backend.modules.rol.dto.RolDto;
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
    public List<RolDto> listar() {
        return rolRepository.findAll().stream().map(this::toDto).toList();
    }

    private RolDto toDto(Rol rol) {
        RolDto dto = new RolDto();
        dto.setId(rol.getId());
        dto.setNombreRol(rol.getNombreRol());
        dto.setPermisos(rol.getPermisos());
        dto.setDeleted(rol.getDeleted());
        return dto;
    }
}
