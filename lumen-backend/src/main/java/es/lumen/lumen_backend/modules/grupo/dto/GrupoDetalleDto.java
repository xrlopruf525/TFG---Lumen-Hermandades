package es.lumen.lumen_backend.modules.grupo.dto;

import java.util.List;

public class GrupoDetalleDto {

    private Integer idGrupo;
    private String nombre;
    private Long numeroMiembros;
    private List<Integer> idHermanos;

    public GrupoDetalleDto() {
    }

    public GrupoDetalleDto(Integer idGrupo, String nombre, Long numeroMiembros, List<Integer> idHermanos) {
        this.idGrupo = idGrupo;
        this.nombre = nombre;
        this.numeroMiembros = numeroMiembros;
        this.idHermanos = idHermanos;
    }

    public Integer getIdGrupo() {
        return idGrupo;
    }

    public void setIdGrupo(Integer idGrupo) {
        this.idGrupo = idGrupo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getNumeroMiembros() {
        return numeroMiembros;
    }

    public void setNumeroMiembros(Long numeroMiembros) {
        this.numeroMiembros = numeroMiembros;
    }

    public List<Integer> getIdHermanos() {
        return idHermanos;
    }

    public void setIdHermanos(List<Integer> idHermanos) {
        this.idHermanos = idHermanos;
    }
}