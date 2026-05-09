package es.lumen.lumen_backend.modules.ticket.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CrearTicketRequestDto {

    private Integer idHermano;
    private Integer idEvento;
    private String concepto;
    private BigDecimal importe;
    private LocalDate fechaEmision;

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
}
