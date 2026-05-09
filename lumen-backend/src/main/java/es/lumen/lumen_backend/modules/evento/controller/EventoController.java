package es.lumen.lumen_backend.modules.evento.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.lumen.lumen_backend.modules.evento.dto.EventoDto;
import es.lumen.lumen_backend.modules.evento.dto.HermanoEventoInscripcionDto;
import es.lumen.lumen_backend.modules.evento.dto.InscripcionEventoRequestDto;
import es.lumen.lumen_backend.modules.evento.service.EventoService;

@RestController
@RequestMapping("/eventos")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping
    public List<EventoDto> listarActivos(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        return eventoService.obtenerEventosVisibles(authentication.getName(), isAdmin);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EventoDto obtenerPorId(@PathVariable Integer id) {
        return eventoService.obtenerPorId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EventoDto crear(@RequestBody EventoDto dto) {
        return eventoService.crear(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EventoDto actualizar(@PathVariable Integer id, @RequestBody EventoDto dto) {
        return eventoService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void bajaLogica(@PathVariable Integer id) {
        eventoService.bajaLogica(id);
    }

    @GetMapping("/{idEvento}/inscripciones")
    @PreAuthorize("hasRole('ADMIN')")
    public List<HermanoEventoInscripcionDto> obtenerInscripciones(@PathVariable Integer idEvento) {
        return eventoService.obtenerInscripciones(idEvento);
    }

    @PostMapping("/{idEvento}/inscripciones")
    @PreAuthorize("hasRole('ADMIN')")
    public void guardarInscripciones(@PathVariable Integer idEvento, @RequestBody InscripcionEventoRequestDto request) {
        eventoService.guardarInscripciones(idEvento, request);
    }
}
