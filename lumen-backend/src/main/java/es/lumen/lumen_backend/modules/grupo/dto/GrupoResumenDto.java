package es.lumen.lumen_backend.modules.grupo.dto;

public class GrupoResumenDto {

    private Integer idGrupo;
    private String nombre;
    private Long numeroMiembros;

    public GrupoResumenDto() {
    }

    public GrupoResumenDto(Integer idGrupo, String nombre, Long numeroMiembros) {
        this.idGrupo = idGrupo;
        this.nombre = nombre;
        this.numeroMiembros = numeroMiembros;
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
}