package es.lumen.lumen_backend.modules.relaciones.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "hermano_rol")
public class HermanoRol {

    @EmbeddedId
    private HermanoRolId id;

    @Column(name = "fecha_asignacion")
    private LocalDate fechaAsignacion;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    public HermanoRolId getId() { return id; }
    public void setId(HermanoRolId id) { this.id = id; }
    public LocalDate getFechaAsignacion() { return fechaAsignacion; }
    public void setFechaAsignacion(LocalDate fechaAsignacion) { this.fechaAsignacion = fechaAsignacion; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
