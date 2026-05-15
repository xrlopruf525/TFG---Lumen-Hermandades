package es.lumen.lumen_backend.modules.evento.service;

import java.util.List;

import es.lumen.lumen_backend.modules.evento.dto.EventoDto;
import es.lumen.lumen_backend.modules.evento.dto.HermanoEventoInscripcionDto;
import es.lumen.lumen_backend.modules.evento.dto.InscripcionEventoRequestDto;

public interface EventoService {

    List<EventoDto> obtenerEventosVisibles(String username, boolean isAdmin);

    EventoDto obtenerPorId(Integer id);

    EventoDto crear(EventoDto dto);

    EventoDto actualizar(Integer id, EventoDto dto);

    void bajaLogica(Integer id);

    List<HermanoEventoInscripcionDto> obtenerInscripciones(Integer idEvento);

    void guardarInscripciones(Integer idEvento, InscripcionEventoRequestDto request);
}
