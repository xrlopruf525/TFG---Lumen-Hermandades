package es.lumen.lumen_backend.modules.grupo.controller;

import es.lumen.lumen_backend.modules.grupo.entity.Grupo;
import es.lumen.lumen_backend.modules.grupo.repository.GrupoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
public class GrupoController {

    private final GrupoRepository grupoRepository;

    public GrupoController(GrupoRepository grupoRepository) {
        this.grupoRepository = grupoRepository;
    }

    @GetMapping
    public List<Grupo> listar() {
        return grupoRepository.findAll();
    }
}
