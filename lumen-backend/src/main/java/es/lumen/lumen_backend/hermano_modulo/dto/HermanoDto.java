package es.lumen.lumen_backend.hermano_modulo.dto;

public class HermanoDto {

    private String nombre;
    private String apellidos;
    private String email;
    private String numeroHermano;
    private String telefono;
    private String direccion;
    private String dni;

    public HermanoDto() {
    }

    public HermanoDto(String nombre, String apellidos, String email, String numeroHermano,
                      String telefono, String direccion, String dni) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.numeroHermano = numeroHermano;
        this.telefono = telefono;
        this.direccion = direccion;
        this.dni = dni;
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }
}