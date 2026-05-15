package es.lumen.lumen_backend.modules.cuota.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class CuotaDto {

    private Integer idCuota;
    private Integer idHermano;
    private Integer anyo;
    private String concepto;
    private BigDecimal importe;
    private String estado;
    private LocalDate fechaPago;
    private String urlRecibo;
    private Boolean deleted;

    public CuotaDto() {}

    public Integer getIdCuota() { return idCuota; }
    public void setIdCuota(Integer idCuota) { this.idCuota = idCuota; }
    public Integer getIdHermano() { return idHermano; }
    public void setIdHermano(Integer idHermano) { this.idHermano = idHermano; }
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
    public String getUrlRecibo() { return urlRecibo; }
    public void setUrlRecibo(String urlRecibo) { this.urlRecibo = urlRecibo; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
