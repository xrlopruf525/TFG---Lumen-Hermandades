package es.lumen.lumen_backend.modules.ticket.service.impl;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.evento.entity.Evento;
import es.lumen.lumen_backend.modules.evento.repository.EventoRepository;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.ticket.dto.CrearTicketRequestDto;
import es.lumen.lumen_backend.modules.ticket.dto.TicketDto;
import es.lumen.lumen_backend.modules.ticket.entity.Ticket;
import es.lumen.lumen_backend.modules.ticket.repository.TicketRepository;
import es.lumen.lumen_backend.modules.ticket.service.TicketService;

@Service
@Transactional(readOnly = true)
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final HermanoRepository hermanoRepository;
    private final EventoRepository eventoRepository;

    public TicketServiceImpl(
            TicketRepository ticketRepository,
            HermanoRepository hermanoRepository,
            EventoRepository eventoRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.hermanoRepository = hermanoRepository;
        this.eventoRepository = eventoRepository;
    }

    @Override
    public List<TicketDto> obtenerTicketsRecientes() {
        return ticketRepository.findTop3ByDeletedFalseOrderByFechaEmisionDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<TicketDto> obtenerTodosActivos() {
        return ticketRepository.findByDeletedFalseOrderByFechaEmisionDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public TicketDto obtenerPorId(Integer id) {
        return toDto(buscarTicket(id));
    }

    @Override
    @Transactional
    public TicketDto crearTicket(CrearTicketRequestDto request) {
        Hermano hermano = hermanoRepository.findById(request.getIdHermano())
                .filter(h -> Boolean.FALSE.equals(h.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Hermano no encontrado con id: " + request.getIdHermano()));

        Evento evento = null;
        if (request.getIdEvento() != null) {
            evento = eventoRepository.findById(request.getIdEvento())
                .filter(e -> Boolean.FALSE.equals(e.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + request.getIdEvento()));
        }

        Ticket ticket = new Ticket();
        ticket.setHermano(hermano);
        ticket.setEvento(evento);
        ticket.setConcepto(normalizarTexto(request.getConcepto()));
        ticket.setImporte(normalizarImporte(request.getImporte()));
        ticket.setFechaEmision(request.getFechaEmision() != null ? request.getFechaEmision() : LocalDate.now());
        ticket.setDeleted(false);

        Ticket guardado = ticketRepository.save(ticket);
        guardado.setUrlPdf(construirUrlPdf(guardado.getIdTicket()));
        guardado = ticketRepository.save(guardado);
        return toDto(guardado);
    }

    @Override
    @Transactional
    public void eliminarTicket(Integer id) {
        Ticket ticket = buscarTicket(id);
        ticket.setDeleted(true);
        ticketRepository.save(ticket);
    }

    @Override
    public byte[] generarPdf(Integer id) {
        Ticket ticket = buscarTicket(id);
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setNonStrokingColor(new Color(20, 20, 20));
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                contentStream.newLineAtOffset(50, 780);
                contentStream.showText("Ticket de pago");
                contentStream.endText();

                escribirLinea(contentStream, 50, 740, "Codigo: " + codigoTicket(ticket), PDType1Font.HELVETICA_BOLD, 12);
                escribirLinea(contentStream, 50, 715, "Hermano: " + nombreHermano(ticket.getHermano()), PDType1Font.HELVETICA, 12);
                escribirLinea(contentStream, 50, 690, "Evento: " + tituloEvento(ticket.getEvento()), PDType1Font.HELVETICA, 12);
                escribirLinea(contentStream, 50, 665, "Concepto: " + valor(ticket.getConcepto()), PDType1Font.HELVETICA, 12);
                escribirLinea(contentStream, 50, 640, "Importe: " + formatImporte(ticket.getImporte()), PDType1Font.HELVETICA, 12);
                escribirLinea(contentStream, 50, 615, "Fecha emision: " + formatFecha(ticket.getFechaEmision()), PDType1Font.HELVETICA, 12);
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("No se ha podido generar el PDF del ticket", e);
        }
    }

    private Ticket buscarTicket(Integer id) {
        return ticketRepository.findById(id)
                .filter(ticket -> Boolean.FALSE.equals(ticket.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado con id: " + id));
    }

    private TicketDto toDto(Ticket ticket) {
        TicketDto dto = new TicketDto();
        dto.setIdTicket(ticket.getIdTicket());
        dto.setIdHermano(ticket.getHermano() != null ? ticket.getHermano().getId() : null);
        dto.setIdEvento(ticket.getEvento() != null ? ticket.getEvento().getIdEvento() : null);
        dto.setConcepto(ticket.getConcepto());
        dto.setImporte(ticket.getImporte());
        dto.setFechaEmision(ticket.getFechaEmision());
        dto.setUrlPdf(ticket.getUrlPdf());
        dto.setDeleted(ticket.getDeleted());
        dto.setNombreHermano(nombreHermano(ticket.getHermano()));
        dto.setTituloEvento(tituloEvento(ticket.getEvento()));
        return dto;
    }

    private String construirUrlPdf(Integer idTicket) {
        return "/tickets/" + idTicket + "/pdf";
    }

    private String nombreHermano(Hermano hermano) {
        if (hermano == null) {
            return "";
        }

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

    private String tituloEvento(Evento evento) {
        return evento == null ? "Sin evento asociado" : valor(evento.getTitulo());
    }

    private String valor(String value) {
        return value == null ? "" : value;
    }

    private String codigoTicket(Ticket ticket) {
        Integer idTicket = ticket.getIdTicket();
        if (idTicket == null) {
            return "TK-0000";
        }
        return String.format("TK-%04d", idTicket);
    }

    private String formatImporte(BigDecimal importe) {
        return String.format("%.2f €", importe == null ? 0 : importe.doubleValue());
    }

    private String formatFecha(LocalDate fecha) {
        return fecha == null ? "" : fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private BigDecimal normalizarImporte(BigDecimal importe) {
        return importe == null ? BigDecimal.ZERO : importe;
    }

    private String normalizarTexto(String texto) {
        return texto == null ? null : texto.trim();
    }

    private void escribirLinea(PDPageContentStream contentStream, float x, float y, String text, PDType1Font font, float size) throws IOException {
        contentStream.beginText();
        contentStream.setFont(font, size);
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(text == null ? "" : text);
        contentStream.endText();
    }
}
