package es.lumen.lumen_backend.modules.grupo.dto;

public class CrearGrupoRequest {

    private String nombre;

    public CrearGrupoRequest() {
    }

    public CrearGrupoRequest(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;   
    }
}