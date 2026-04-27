package es.lumen.lumen_backend.hermano_modulo.dto;

import java.time.LocalDate;

public class PortalHermanoDto {

    private Long id;
    private String nombreCompleto;
    private String numeroHermano;
    private String email;
    private String telefono;
    private String direccion;
    private String dni;
    private LocalDate fechaAlta;
    private Boolean activo;

    public PortalHermanoDto() {
    }

    public PortalHermanoDto(Long id, String nombreCompleto, String numeroHermano,
                            String email, String telefono, String direccion,
                            String dni, LocalDate fechaAlta, Boolean activo) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.numeroHermano = numeroHermano;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.dni = dni;
        this.fechaAlta = fechaAlta;
        this.activo = activo;
    }

    public Long getId() {
        return id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public String getNumeroHermano() {
        return numeroHermano;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getDni() {
        return dni;
    }

    public LocalDate getFechaAlta() {
        return fechaAlta;
    }

    public Boolean getActivo() {
        return activo;
    }
}