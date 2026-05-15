package es.lumen.lumen_backend.modules.cuota.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CuotaResumenDto {

    private Integer idCuota;
    private Integer anyo;
    private String concepto;
    private BigDecimal importe;
    private String estado;
    private LocalDate fechaPago;

    public CuotaResumenDto() {
    }

    public CuotaResumenDto(Integer idCuota, Integer anyo, String concepto, BigDecimal importe, String estado, LocalDate fechaPago) {
        this.idCuota = idCuota;
        this.anyo = anyo;
        this.concepto = concepto;
        this.importe = importe;
        this.estado = estado;
        this.fechaPago = fechaPago;
    }

    public Integer getIdCuota() { return idCuota; }
    public void setIdCuota(Integer idCuota) { this.idCuota = idCuota; }
    public Integer getAnyo() { return anyo; }
    public void setAnyo(Integer anyo) { this.anyo = anyo; }
    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }
    public BigDecimal getImporte() { return importe; }
    public void setImporte(BigDecimal importe) { this.importe = importe; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDate getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDate fechaPago) { this.fechaPago = fechaPago; }
}
