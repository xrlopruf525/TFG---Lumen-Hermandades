package es.lumen.lumen_backend.modules.gasto.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class GastoRequest {

    @NotBlank(message = "El concepto es obligatorio")
    @Size(max = 255, message = "El concepto no puede superar 255 caracteres")
    private String concepto;

    @NotNull(message = "El importe es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El importe no puede ser negativo")
    private BigDecimal importe;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @Size(max = 255, message = "El proveedor no puede superar 255 caracteres")
    private String proveedor;

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

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }
}
