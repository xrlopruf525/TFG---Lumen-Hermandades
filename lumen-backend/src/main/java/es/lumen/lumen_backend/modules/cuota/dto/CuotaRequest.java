package es.lumen.lumen_backend.modules.cuota.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CuotaRequest {

    @NotNull(message = "El hermano es obligatorio")
    private Integer idHermano;

    @NotNull(message = "El año es obligatorio")
    private Integer anyo;

    @NotBlank(message = "El concepto es obligatorio")
    @Size(max = 150, message = "El concepto no puede superar 150 caracteres")
    private String concepto;

    @NotNull(message = "El importe es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El importe no puede ser negativo")
    private BigDecimal importe;

    private String estado;

    private LocalDate fechaPago;

    private String urlRecibo;

    public Integer getIdHermano() {
        return idHermano;
    }

    public void setIdHermano(Integer idHermano) {
        this.idHermano = idHermano;
    }

    public Integer getAnyo() {
        return anyo;
    }

    public void setAnyo(Integer anyo) {
        this.anyo = anyo;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public String getUrlRecibo() {
        return urlRecibo;
    }

    public void setUrlRecibo(String urlRecibo) {
        this.urlRecibo = urlRecibo;
    }
}
