package es.lumen.lumen_backend.modules.relaciones.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "hermano_grupo")
public class HermanoGrupo {

    @EmbeddedId
    private HermanoGrupoId id;

    @Column(name = "fecha_incorporacion")
    private LocalDate fechaIncorporacion;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    public HermanoGrupoId getId() { return id; }
    public void setId(HermanoGrupoId id) { this.id = id; }
    public LocalDate getFechaIncorporacion() { return fechaIncorporacion; }
    public void setFechaIncorporacion(LocalDate fechaIncorporacion) { this.fechaIncorporacion = fechaIncorporacion; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
