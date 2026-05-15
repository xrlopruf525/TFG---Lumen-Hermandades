package es.lumen.lumen_backend.modules.ticket.service;

import java.util.List;

import es.lumen.lumen_backend.modules.ticket.dto.CrearTicketRequestDto;
import es.lumen.lumen_backend.modules.ticket.dto.TicketDto;

public interface TicketService {

    List<TicketDto> obtenerTicketsRecientes();

    List<TicketDto> obtenerTodosActivos();

    TicketDto obtenerPorId(Integer id);

    TicketDto crearTicket(CrearTicketRequestDto request);

    void eliminarTicket(Integer id);

    byte[] generarPdf(Integer id);
}
