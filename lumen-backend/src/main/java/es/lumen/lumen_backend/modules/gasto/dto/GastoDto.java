package es.lumen.lumen_backend.modules.gasto.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GastoDto {

    private Integer idGasto;
    private Integer idHermandad;
    private String concepto;
    private BigDecimal importe;
    private LocalDate fecha;
    private String proveedor;
    private Boolean deleted;

    public GastoDto() {}

    public Integer getIdGasto() { return idGasto; }
    public void setIdGasto(Integer idGasto) { this.idGasto = idGasto; }
    public Integer getIdHermandad() { return idHermandad; }
    public void setIdHermandad(Integer idHermandad) { this.idHermandad = idHermandad; }
    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }
    public BigDecimal getImporte() { return importe; }
    public void setImporte(BigDecimal importe) { this.importe = importe; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
