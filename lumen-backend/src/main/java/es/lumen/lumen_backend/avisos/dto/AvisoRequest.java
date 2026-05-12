package es.lumen.lumen_backend.avisos.dto;

public class AvisoRequest {

    private String tipoDestinatario; // HERMANO, GRUPO, TODOS
    private Long idHermano;
    private Long idGrupo;
    private String asunto;
    private String mensaje;

    public String getTipoDestinatario() {
        return tipoDestinatario;
    }

    public void setTipoDestinatario(String tipoDestinatario) {
        this.tipoDestinatario = tipoDestinatario;
    }

    public Long getIdHermano() {
        return idHermano;
    }

    public void setIdHermano(Long idHermano) {
        this.idHermano = idHermano;
    }

    public Long getIdGrupo() {
        return idGrupo;
    }

    public void setIdGrupo(Long idGrupo) {
        this.idGrupo = idGrupo;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }   

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}