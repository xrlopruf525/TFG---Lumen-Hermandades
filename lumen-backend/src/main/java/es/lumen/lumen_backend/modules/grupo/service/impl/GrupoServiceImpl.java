package es.lumen.lumen_backend.modules.grupo.service.impl;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.grupo.dto.ActualizarGrupoHermanosRequest;
import es.lumen.lumen_backend.modules.grupo.dto.CrearGrupoRequest;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoDetalleDto;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoResumenDto;
import es.lumen.lumen_backend.modules.grupo.entity.Grupo;
import es.lumen.lumen_backend.modules.grupo.repository.GrupoRepository;
import es.lumen.lumen_backend.modules.grupo.service.GrupoService;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupo;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupoId;
import es.lumen.lumen_backend.modules.relaciones.repository.HermanoGrupoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GrupoServiceImpl implements GrupoService {

    private final GrupoRepository grupoRepository;
    private final HermanoRepository hermanoRepository;
    private final HermanoGrupoRepository hermanoGrupoRepository;

    public GrupoServiceImpl(
            GrupoRepository grupoRepository,
            HermanoRepository hermanoRepository,
            HermanoGrupoRepository hermanoGrupoRepository
    ) {
        this.grupoRepository = grupoRepository;
        this.hermanoRepository = hermanoRepository;
        this.hermanoGrupoRepository = hermanoGrupoRepository;
    }

    @Override
    public List<GrupoResumenDto> listarGrupos() {
        return grupoRepository.findByDeletedFalse()
                .stream()
                .map(this::toResumenDto)
                .toList();
    }

    @Override
    public GrupoDetalleDto obtenerGrupo(Integer idGrupo) {
        return toDetalleDto(buscarGrupoActivoPorId(idGrupo));
    }

    @Override
    @Transactional
    public GrupoDetalleDto crearGrupo(CrearGrupoRequest request) {
        String nombreLimpio = limpiarNombre(request.getNombre());

        if (grupoRepository.existsByNombreIgnoreCaseAndDeletedFalse(nombreLimpio)) {
            throw new IllegalArgumentException("Ya existe un grupo con ese nombre.");
        }

        Grupo grupo = new Grupo();
        grupo.setNombre(nombreLimpio);
        grupo.setDeleted(false);

        return toDetalleDto(grupoRepository.save(grupo));
    }

    @Override
    @Transactional
    public GrupoDetalleDto actualizarGrupo(Integer idGrupo, CrearGrupoRequest request) {
        Grupo grupo = buscarGrupoActivoPorId(idGrupo);
        String nombreLimpio = limpiarNombre(request.getNombre());

        if (!nombreLimpio.equalsIgnoreCase(grupo.getNombre())
                && grupoRepository.existsByNombreIgnoreCaseAndDeletedFalse(nombreLimpio)) {
            throw new IllegalArgumentException("Ya existe un grupo con ese nombre.");
        }

        grupo.setNombre(nombreLimpio);
        return toDetalleDto(grupoRepository.save(grupo));
    }

    @Override
    @Transactional
    public GrupoDetalleDto actualizarHermanos(Integer idGrupo, ActualizarGrupoHermanosRequest request) {
        Grupo grupo = buscarGrupoActivoPorId(idGrupo);
        Set<Integer> idsDeseados = request.getIdHermanos() == null
                ? new LinkedHashSet<>()
                : request.getIdHermanos().stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        List<Hermano> hermanosActivos = idsDeseados.isEmpty()
                ? List.of()
                : hermanoRepository.findByIdInAndDeletedFalse(new ArrayList<>(idsDeseados));

        if (hermanosActivos.size() != idsDeseados.size()) {
            throw new IllegalArgumentException("Algún hermano no existe o está inactivo.");
        }

        List<HermanoGrupo> relacionesExistentes = hermanoGrupoRepository.findByIdIdGrupo(grupo.getId());
        Map<Integer, HermanoGrupo> relacionesPorHermano = relacionesExistentes.stream()
                .collect(Collectors.toMap(relacion -> relacion.getId().getIdHermano(), Function.identity(), (a, b) -> a));

        List<HermanoGrupo> relacionesParaGuardar = new ArrayList<>();

        for (Integer idHermano : idsDeseados) {
            HermanoGrupo relacion = relacionesPorHermano.get(idHermano);
            if (relacion == null) {
                relacion = new HermanoGrupo();
                relacion.setId(new HermanoGrupoId(idHermano, grupo.getId()));
                relacion.setFechaIncorporacion(LocalDate.now());
            } else {
                relacion.setDeleted(false);
                if (relacion.getFechaIncorporacion() == null) {
                    relacion.setFechaIncorporacion(LocalDate.now());
                }
            }
            relacionesParaGuardar.add(relacion);
        }

        for (HermanoGrupo relacion : relacionesExistentes) {
            if (!idsDeseados.contains(relacion.getId().getIdHermano())) {
                relacion.setDeleted(true);
                relacionesParaGuardar.add(relacion);
            }
        }

        hermanoGrupoRepository.saveAll(relacionesParaGuardar);
        return toDetalleDto(grupo);
    }

    private Grupo buscarGrupoActivoPorId(Integer idGrupo) {
        return grupoRepository.findByIdAndDeletedFalse(idGrupo)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id: " + idGrupo));
    }

    private GrupoResumenDto toResumenDto(Grupo grupo) {
        return new GrupoResumenDto(
                grupo.getId(),
                grupo.getNombre(),
                hermanoGrupoRepository.countByIdIdGrupoAndDeletedFalse(grupo.getId())
        );
    }

    private GrupoDetalleDto toDetalleDto(Grupo grupo) {
        List<Integer> idHermanos = hermanoGrupoRepository.findByIdIdGrupoAndDeletedFalse(grupo.getId())
                .stream()
                .map(relacion -> relacion.getId().getIdHermano())
                .toList();

        return new GrupoDetalleDto(
                grupo.getId(),
                grupo.getNombre(),
                (long) idHermanos.size(),
                idHermanos
        );
    }

    private String limpiarNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del grupo es obligatorio.");
        }
        return nombre.trim();
    }
}