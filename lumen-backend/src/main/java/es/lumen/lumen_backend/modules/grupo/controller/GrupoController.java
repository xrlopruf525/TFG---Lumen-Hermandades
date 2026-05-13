package es.lumen.lumen_backend.modules.grupo.controller;

import es.lumen.lumen_backend.modules.grupo.entity.Grupo;
import es.lumen.lumen_backend.modules.grupo.repository.GrupoRepository;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupo;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupoId;
import es.lumen.lumen_backend.modules.relaciones.repository.HermanoGrupoRepository;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/grupos")
public class GrupoController {

    private final GrupoRepository grupoRepository;
    private final HermanoGrupoRepository hermanoGrupoRepository;
    private final HermanoRepository hermanoRepository;

    public GrupoController(GrupoRepository grupoRepository, 
                          HermanoGrupoRepository hermanoGrupoRepository,
                          HermanoRepository hermanoRepository) {
        this.grupoRepository = grupoRepository;
        this.hermanoGrupoRepository = hermanoGrupoRepository;
        this.hermanoRepository = hermanoRepository;
    }

    @GetMapping
    public List<Grupo> listar() {
        return grupoRepository.findAll()
                .stream()
                .filter(g -> !g.getDeleted())
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grupo> obtenerPorId(@PathVariable Integer id) {
        Optional<Grupo> grupo = grupoRepository.findById(id);
        if (grupo.isPresent() && !grupo.get().getDeleted()) {
            return ResponseEntity.ok(grupo.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Grupo> crear(@RequestBody Grupo grupo) {
        grupo.setDeleted(false);
        Grupo nuevoGrupo = grupoRepository.save(grupo);
        return ResponseEntity.ok(nuevoGrupo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grupo> actualizar(@PathVariable Integer id, @RequestBody Grupo grupoActualizado) {
        Optional<Grupo> grupoExistente = grupoRepository.findById(id);
        if (grupoExistente.isPresent()) {
            Grupo grupo = grupoExistente.get();
            if (grupoActualizado.getNombre() != null) {
                grupo.setNombre(grupoActualizado.getNombre());
            }
            if (grupoActualizado.getTipo() != null) {
                grupo.setTipo(grupoActualizado.getTipo());
            }
            if (grupoActualizado.getDescripcion() != null) {
                grupo.setDescripcion(grupoActualizado.getDescripcion());
            }
            grupoRepository.save(grupo);
            return ResponseEntity.ok(grupo);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Optional<Grupo> grupo = grupoRepository.findById(id);
        if (grupo.isPresent()) {
            Grupo g = grupo.get();
            g.setDeleted(true);
            grupoRepository.save(g);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{idGrupo}/hermanos")
    public ResponseEntity<List<Hermano>> obtenerHermanosDelGrupo(@PathVariable Integer idGrupo) {
        Optional<Grupo> grupo = grupoRepository.findById(idGrupo);
        if (grupo.isEmpty() || grupo.get().getDeleted()) {
            return ResponseEntity.notFound().build();
        }

        List<Hermano> hermanos = hermanoGrupoRepository.findByIdIdGrupoAndDeletedFalse(idGrupo)
                .stream()
                .map(hg -> hermanoRepository.findById(hg.getId().getIdHermano()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(h -> !h.getDeleted())
                .collect(Collectors.toList());

        return ResponseEntity.ok(hermanos);
    }

    @PostMapping("/{idGrupo}/hermanos/{idHermano}")
    public ResponseEntity<?> agregarHermanoAlGrupo(@PathVariable Integer idGrupo, @PathVariable Integer idHermano) {
        Optional<Grupo> grupo = grupoRepository.findById(idGrupo);
        Optional<Hermano> hermano = hermanoRepository.findById(idHermano);

        if (grupo.isEmpty() || hermano.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (grupo.get().getDeleted() || hermano.get().getDeleted()) {
            return ResponseEntity.badRequest().body("El grupo o hermano no existe");
        }

        HermanoGrupoId id = new HermanoGrupoId(idHermano, idGrupo);
        Optional<HermanoGrupo> existente = hermanoGrupoRepository.findById(id);

        if (existente.isPresent()) {
            HermanoGrupo hg = existente.get();
            if (hg.getDeleted()) {
                hg.setDeleted(false);
                hermanoGrupoRepository.save(hg);
            }
            return ResponseEntity.ok("Hermano agregado al grupo");
        }

        HermanoGrupo hermanoGrupo = new HermanoGrupo();
        hermanoGrupo.setId(id);
        hermanoGrupo.setFechaIncorporacion(LocalDate.now());
        hermanoGrupo.setDeleted(false);
        hermanoGrupoRepository.save(hermanoGrupo);

        return ResponseEntity.ok("Hermano agregado al grupo");
    }

    @DeleteMapping("/{idGrupo}/hermanos/{idHermano}")
    public ResponseEntity<?> quitarHermanoDelGrupo(@PathVariable Integer idGrupo, @PathVariable Integer idHermano) {
        HermanoGrupoId id = new HermanoGrupoId(idHermano, idGrupo);
        Optional<HermanoGrupo> hermanoGrupo = hermanoGrupoRepository.findById(id);

        if (hermanoGrupo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        HermanoGrupo hg = hermanoGrupo.get();
        hg.setDeleted(true);
        hermanoGrupoRepository.save(hg);

        return ResponseEntity.ok("Hermano removido del grupo");
    }
}
