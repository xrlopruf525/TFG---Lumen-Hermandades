package es.lumen.lumen_backend.modules.ticket.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.lumen.lumen_backend.modules.ticket.dto.CrearTicketRequestDto;
import es.lumen.lumen_backend.modules.ticket.dto.TicketDto;
import es.lumen.lumen_backend.modules.ticket.service.TicketService;

@RestController
@RequestMapping("/tickets")
@PreAuthorize("hasRole('ADMIN')")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/recientes")
    public List<TicketDto> obtenerRecientes() {
        return ticketService.obtenerTicketsRecientes();
    }

    @GetMapping
    public List<TicketDto> obtenerTodos() {
        return ticketService.obtenerTodosActivos();
    }

    @GetMapping("/{id}")
    public TicketDto obtenerPorId(@PathVariable Integer id) {
        return ticketService.obtenerPorId(id);
    }

    @PostMapping
    public TicketDto crear(@RequestBody CrearTicketRequestDto request) {
        return ticketService.crearTicket(request);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        ticketService.eliminarTicket(id);
    }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Integer id) {
        byte[] pdf = ticketService.generarPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ticket-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
