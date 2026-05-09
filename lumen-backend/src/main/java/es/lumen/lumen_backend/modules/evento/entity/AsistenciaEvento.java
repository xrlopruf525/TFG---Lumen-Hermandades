package es.lumen.lumen_backend.modules.evento.entity;

import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "Asistencia_Evento")
public class AsistenciaEvento {

    @EmbeddedId
    private AsistenciaEventoId id;

    @MapsId("idHermano")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_hermano", nullable = false)
    private Hermano hermano;

    @MapsId("idEvento")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;

    @Column(name = "estado_asistencia", length = 50)
    private String estadoAsistencia;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    public AsistenciaEventoId getId() {
        return id;
    }

    public void setId(AsistenciaEventoId id) {
        this.id = id;
    }

    public Hermano getHermano() {
        return hermano;
    }

    public void setHermano(Hermano hermano) {
        this.hermano = hermano;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public String getEstadoAsistencia() {
        return estadoAsistencia;
    }

    public void setEstadoAsistencia(String estadoAsistencia) {
        this.estadoAsistencia = estadoAsistencia;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
