package es.lumen.lumen_backend.modules.ticket.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TicketDto {

    private Integer idTicket;
    private Integer idHermano;
    private Integer idEvento;
    private String concepto;
    private BigDecimal importe;
    private LocalDate fechaEmision;
    private String urlPdf;
    private Boolean deleted;
    private String nombreHermano;
    private String tituloEvento;

    public Integer getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(Integer idTicket) {
        this.idTicket = idTicket;
    }

    public Integer getIdHermano() {
        return idHermano;
    }

    public void setIdHermano(Integer idHermano) {
        this.idHermano = idHermano;
    }

    public Integer getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
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

    public String getNombreHermano() {
        return nombreHermano;
    }

    public void setNombreHermano(String nombreHermano) {
        this.nombreHermano = nombreHermano;
    }

    public String getTituloEvento() {
        return tituloEvento;
    }

    public void setTituloEvento(String tituloEvento) {
        this.tituloEvento = tituloEvento;
    }
}
