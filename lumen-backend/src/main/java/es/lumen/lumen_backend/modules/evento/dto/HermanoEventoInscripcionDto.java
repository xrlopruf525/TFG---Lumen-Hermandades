package es.lumen.lumen_backend.modules.evento.dto;

public class HermanoEventoInscripcionDto {

    private Integer idHermano;
    private Integer numeroHermano;
    private String nombreCompleto;
    private Boolean inscrito;

    public Integer getIdHermano() {
        return idHermano;
    }

    public void setIdHermano(Integer idHermano) {
        this.idHermano = idHermano;
    }

    public Integer getNumeroHermano() {
        return numeroHermano;
    }

    public void setNumeroHermano(Integer numeroHermano) {
        this.numeroHermano = numeroHermano;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public Boolean getInscrito() {
        return inscrito;
    }

    public void setInscrito(Boolean inscrito) {
        this.inscrito = inscrito;
    }
}
