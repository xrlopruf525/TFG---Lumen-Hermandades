package es.lumen.lumen_backend.modules.ticket.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import es.lumen.lumen_backend.modules.evento.entity.Evento;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ticket")
    private Integer idTicket;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_hermano", nullable = false)
    private Hermano hermano;

    @ManyToOne(optional = true)
    @JoinColumn(name = "id_evento", nullable = true)
    private Evento evento;

    @Column(name = "concepto", length = 255)
    private String concepto;

    @Column(name = "importe", precision = 10, scale = 2)
    private BigDecimal importe;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "url_pdf", length = 255)
    private String urlPdf;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    public Integer getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(Integer idTicket) {
        this.idTicket = idTicket;
    }

    public Hermano getHermano() {
        return hermano;
    }

    public void setHermano(Hermano hermano) {
        this.hermano = hermano;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public String getConcepto() {
        return concepto;
    }

    public void setConcepto(String concepto) {
        this.concepto = concepto;
    }

    public BigDecimal getImporte() {
        return importe;
    }

    public void setImporte(BigDecimal importe) {
        this.importe = importe;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public String getUrlPdf() {
        return urlPdf;
    }

    public void setUrlPdf(String urlPdf) {
        this.urlPdf = urlPdf;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
