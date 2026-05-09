package es.lumen.lumen_backend.modules.evento.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class AsistenciaEventoId implements Serializable {

    @Column(name = "id_hermano")
    private Integer idHermano;

    @Column(name = "id_evento")
    private Integer idEvento;

    public AsistenciaEventoId() {
    }

    public AsistenciaEventoId(Integer idHermano, Integer idEvento) {
        this.idHermano = idHermano;
        this.idEvento = idEvento;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AsistenciaEventoId that = (AsistenciaEventoId) o;
        return Objects.equals(idHermano, that.idHermano) && Objects.equals(idEvento, that.idEvento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idHermano, idEvento);
    }
}
