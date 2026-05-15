package es.lumen.lumen_backend.modules.relaciones.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class HermanoGrupoId implements Serializable {

    @Column(name = "id_hermano")
    private Integer idHermano;

    @Column(name = "id_grupo")
    private Integer idGrupo;

    public HermanoGrupoId() {
    }

    public HermanoGrupoId(Integer idHermano, Integer idGrupo) {
        this.idHermano = idHermano;
        this.idGrupo = idGrupo;
    }

    public Integer getIdHermano() { return idHermano; }
    public void setIdHermano(Integer idHermano) { this.idHermano = idHermano; }
    public Integer getIdGrupo() { return idGrupo; }
    public void setIdGrupo(Integer idGrupo) { this.idGrupo = idGrupo; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HermanoGrupoId that = (HermanoGrupoId) o;
        return Objects.equals(idHermano, that.idHermano) && Objects.equals(idGrupo, that.idGrupo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idHermano, idGrupo);
    }
}
