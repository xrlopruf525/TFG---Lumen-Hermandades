package es.lumen.lumen_backend.modules.evento.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.evento.entity.AsistenciaEvento;
import es.lumen.lumen_backend.modules.evento.entity.AsistenciaEventoId;
import es.lumen.lumen_backend.modules.evento.dto.EventoDto;
import es.lumen.lumen_backend.modules.evento.dto.HermanoEventoInscripcionDto;
import es.lumen.lumen_backend.modules.evento.dto.InscripcionEventoRequestDto;
import es.lumen.lumen_backend.modules.evento.entity.Evento;
import es.lumen.lumen_backend.modules.evento.repository.AsistenciaEventoRepository;
import es.lumen.lumen_backend.modules.evento.repository.EventoRepository;
import es.lumen.lumen_backend.modules.evento.service.EventoService;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;

@Service
@Transactional(readOnly = true)
public class EventoServiceImpl implements EventoService {

    private static final String GOOGLE_CALENDAR_BASE_URL = "https://calendar.google.com/calendar/render?action=TEMPLATE";

    private final EventoRepository eventoRepository;
    private final AsistenciaEventoRepository asistenciaEventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HermanoRepository hermanoRepository;

    public EventoServiceImpl(
            EventoRepository eventoRepository,
            AsistenciaEventoRepository asistenciaEventoRepository,
            UsuarioRepository usuarioRepository,
            HermanoRepository hermanoRepository
    ) {
        this.eventoRepository = eventoRepository;
        this.asistenciaEventoRepository = asistenciaEventoRepository;
        this.usuarioRepository = usuarioRepository;
        this.hermanoRepository = hermanoRepository;
    }

    @Override
    public List<EventoDto> obtenerEventosVisibles(String username, boolean isAdmin) {
        if (isAdmin) {
            return eventoRepository.findByDeletedFalseOrderByFechaInicioAsc()
                    .stream()
                    .map(this::toDto)
                    .toList();
        }

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Hermano hermano = hermanoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Hermano no encontrado"));

        List<AsistenciaEvento> asistencias = asistenciaEventoRepository.findByHermano_IdAndDeletedFalse(hermano.getId());

        return asistencias.stream()
                .map(AsistenciaEvento::getEvento)
                .filter(Objects::nonNull)
                .filter(evento -> Boolean.FALSE.equals(evento.getDeleted()))
                .distinct()
                .sorted((a, b) -> {
                    LocalDate fa = a.getFechaInicio();
                    LocalDate fb = b.getFechaInicio();
                    if (fa == null && fb == null) {
                        return 0;
                    }
                    if (fa == null) {
                        return 1;
                    }
                    if (fb == null) {
                        return -1;
                    }
                    return fa.compareTo(fb);
                })
                .map(this::toDto)
                .toList();
    }

    @Override
    public EventoDto obtenerPorId(Integer id) {
        Evento evento = buscarEntidadPorId(id);
        return toDto(evento);
    }

    @Override
    @Transactional
    public EventoDto crear(EventoDto dto) {
        Evento evento = new Evento(dto);
        if (evento.getIdHermandad() == null) {
            evento.setIdHermandad(1);
        }
        Evento guardado = eventoRepository.save(evento);
        return toDto(guardado);
    }

    @Override
    @Transactional
    public EventoDto actualizar(Integer id, EventoDto dto) {
        Evento evento = buscarEntidadPorId(id);
        evento.actualizarDesdeDto(dto);
        if (evento.getIdHermandad() == null) {
            evento.setIdHermandad(1);
        }
        Evento actualizado = eventoRepository.save(evento);
        return toDto(actualizado);
    }

    @Override
    @Transactional
    public void bajaLogica(Integer id) {
        Evento evento = buscarEntidadPorId(id);
        evento.setDeleted(true);
        eventoRepository.save(evento);
    }

    @Override
    public List<HermanoEventoInscripcionDto> obtenerInscripciones(Integer idEvento) {
        buscarEntidadPorId(idEvento);

        List<Hermano> hermanosActivos = hermanoRepository.findByDeletedFalse();
        List<AsistenciaEvento> asistencias = asistenciaEventoRepository.findByEvento_IdEventoAndDeletedFalse(idEvento);

        Set<Integer> idsInscritos = new HashSet<>();
        for (AsistenciaEvento asistencia : asistencias) {
            if (asistencia.getHermano() != null && asistencia.getHermano().getId() != null) {
                idsInscritos.add(asistencia.getHermano().getId());
            }
        }

        List<HermanoEventoInscripcionDto> resultado = new ArrayList<>();
        for (Hermano hermano : hermanosActivos) {
            HermanoEventoInscripcionDto dto = new HermanoEventoInscripcionDto();
            dto.setIdHermano(hermano.getId());
            dto.setNumeroHermano(hermano.getNumeroHermano());
            dto.setNombreCompleto(construirNombreCompleto(hermano));
            dto.setInscrito(idsInscritos.contains(hermano.getId()));
            resultado.add(dto);
        }

        resultado.sort((a, b) -> a.getNombreCompleto().compareToIgnoreCase(b.getNombreCompleto()));
        return resultado;
    }

    @Override
    @Transactional
    public void guardarInscripciones(Integer idEvento, InscripcionEventoRequestDto request) {
        Evento evento = buscarEntidadPorId(idEvento);

        List<Hermano> hermanosActivos = hermanoRepository.findByDeletedFalse();
        Map<Integer, Hermano> hermanoActivoPorId = new HashMap<>();
        for (Hermano hermano : hermanosActivos) {
            hermanoActivoPorId.put(hermano.getId(), hermano);
        }

        Set<Integer> idsObjetivo = new HashSet<>();
        boolean inscribirTodos = Boolean.TRUE.equals(request.getInscribirTodos());
        if (inscribirTodos) {
            idsObjetivo.addAll(hermanoActivoPorId.keySet());
        } else if (request.getHermanoIds() != null) {
            for (Integer idHermano : request.getHermanoIds()) {
                if (idHermano != null && hermanoActivoPorId.containsKey(idHermano)) {
                    idsObjetivo.add(idHermano);
                }
            }
        }

        List<AsistenciaEvento> asistenciasExistentes = asistenciaEventoRepository.findByEvento_IdEvento(idEvento);
        Map<Integer, AsistenciaEvento> asistenciaPorHermanoId = new HashMap<>();
        for (AsistenciaEvento asistencia : asistenciasExistentes) {
            if (asistencia.getHermano() != null && asistencia.getHermano().getId() != null) {
                asistenciaPorHermanoId.put(asistencia.getHermano().getId(), asistencia);
            }
        }

        for (Map.Entry<Integer, Hermano> entry : hermanoActivoPorId.entrySet()) {
            Integer idHermano = entry.getKey();
            Hermano hermano = entry.getValue();
            boolean debeEstarInscrito = idsObjetivo.contains(idHermano);

            AsistenciaEvento existente = asistenciaPorHermanoId.get(idHermano);
            if (debeEstarInscrito) {
                if (existente == null) {
                    AsistenciaEvento nueva = new AsistenciaEvento();
                    nueva.setId(new AsistenciaEventoId(idHermano, idEvento));
                    nueva.setHermano(hermano);
                    nueva.setEvento(evento);
                    nueva.setEstadoAsistencia("INSCRITO");
                    nueva.setDeleted(false);
                    asistenciaEventoRepository.save(nueva);
                } else {
                    existente.setDeleted(false);
                    if (existente.getEstadoAsistencia() == null || existente.getEstadoAsistencia().isBlank()) {
                        existente.setEstadoAsistencia("INSCRITO");
                    }
                    asistenciaEventoRepository.save(existente);
                }
            } else if (existente != null && Boolean.FALSE.equals(existente.getDeleted())) {
                existente.setDeleted(true);
                asistenciaEventoRepository.save(existente);
            }
        }
    }

    private Evento buscarEntidadPorId(Integer id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + id));
    }

    private EventoDto toDto(Evento evento) {
        EventoDto dto = new EventoDto();
        dto.setIdEvento(evento.getIdEvento());
        dto.setIdHermandad(evento.getIdHermandad());
        dto.setTitulo(evento.getTitulo());
        dto.setFechaInicio(evento.getFechaInicio());
        dto.setFechaFin(evento.getFechaFin());
        dto.setLugar(evento.getLugar());
        dto.setTipoEvento(evento.getTipoEvento());
        dto.setDeleted(evento.getDeleted());
        dto.setGoogleCalendarUrl(generarEnlaceGoogleCalendar(evento));
        return dto;
    }

    private String generarEnlaceGoogleCalendar(Evento evento) {
        LocalDate fechaInicio = evento.getFechaInicio();
        if (fechaInicio == null) {
            return null;
        }

        LocalDate fechaFin = evento.getFechaFin() != null ? evento.getFechaFin() : fechaInicio;
        LocalDate fechaFinExclusiva = fechaFin.plusDays(1);
        String rangoFechas = formatDate(fechaInicio) + "/" + formatDate(fechaFinExclusiva);

        StringBuilder enlace = new StringBuilder(GOOGLE_CALENDAR_BASE_URL);
        enlace.append("&text=").append(encode(evento.getTitulo()));
        enlace.append("&dates=").append(encode(rangoFechas));

        if (evento.getLugar() != null && !evento.getLugar().isBlank()) {
            enlace.append("&location=").append(encode(evento.getLugar()));
        }

        if (evento.getTipoEvento() != null && !evento.getTipoEvento().isBlank()) {
            enlace.append("&details=").append(encode("Tipo de evento: " + evento.getTipoEvento()));
        }

        return enlace.toString();
    }

    private String formatDate(LocalDate date) {
        return date.format(DateTimeFormatter.BASIC_ISO_DATE);
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    private String construirNombreCompleto(Hermano hermano) {
        StringBuilder nombre = new StringBuilder();
        if (hermano.getNombre() != null) {
            nombre.append(hermano.getNombre().trim());
        }
        if (hermano.getPrimerApellido() != null && !hermano.getPrimerApellido().isBlank()) {
            if (nombre.length() > 0) {
                nombre.append(' ');
            }
            nombre.append(hermano.getPrimerApellido().trim());
        }
        if (hermano.getSegundoApellido() != null && !hermano.getSegundoApellido().isBlank()) {
            if (nombre.length() > 0) {
                nombre.append(' ');
            }
            nombre.append(hermano.getSegundoApellido().trim());
        }
        return nombre.toString();
    }
}
