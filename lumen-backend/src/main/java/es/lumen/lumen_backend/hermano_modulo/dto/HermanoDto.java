package es.lumen.lumen_backend.hermano_modulo.dto;

public class HermanoDto {
    private String nombre;
    private String apellidos;
    private String email;
    private String numeroHermano;

    public HermanoDto() {}

    public HermanoDto(String nombre, String apellidos, String email, String numeroHermano) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.numeroHermano = numeroHermano;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNumeroHermano() {
        return numeroHermano;
    }

    public void setNumeroHermano(String numeroHermano) {
        this.numeroHermano = numeroHermano;
    }
}