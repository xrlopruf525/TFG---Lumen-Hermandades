package es.lumen.lumen_backend.modules.relaciones.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class HermanoRolId implements Serializable {

    @Column(name = "id_hermano")
    private Integer idHermano;

    @Column(name = "id_rol")
    private Integer idRol;

    public HermanoRolId() {
    }

    public HermanoRolId(Integer idHermano, Integer idRol) {
        this.idHermano = idHermano;
        this.idRol = idRol;
    }

    public Integer getIdHermano() { return idHermano; }
    public void setIdHermano(Integer idHermano) { this.idHermano = idHermano; }
    public Integer getIdRol() { return idRol; }
    public void setIdRol(Integer idRol) { this.idRol = idRol; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HermanoRolId that = (HermanoRolId) o;
        return Objects.equals(idHermano, that.idHermano) && Objects.equals(idRol, that.idRol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idHermano, idRol);
    }
}
