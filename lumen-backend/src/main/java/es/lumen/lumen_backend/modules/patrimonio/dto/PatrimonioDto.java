package es.lumen.lumen_backend.modules.patrimonio.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PatrimonioDto {

    private Integer idPatrimonio;
    private String nombre;
    private String descripcion;
    private String categoria;
    private String estado;
    private String ubicacion;
    private LocalDate fechaAdquisicion;
    private BigDecimal valorEstimado;
    private String imagenUrl;
    private Boolean deleted;

    public Integer getIdPatrimonio() {
        return idPatrimonio;
    }

    public void setIdPatrimonio(Integer idPatrimonio) {
        this.idPatrimonio = idPatrimonio;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDate getFechaAdquisicion() {
        return fechaAdquisicion;
    }

    public void setFechaAdquisicion(LocalDate fechaAdquisicion) {
        this.fechaAdquisicion = fechaAdquisicion;
    }

    public BigDecimal getValorEstimado() {
        return valorEstimado;
    }

    public void setValorEstimado(BigDecimal valorEstimado) {
        this.valorEstimado = valorEstimado;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
