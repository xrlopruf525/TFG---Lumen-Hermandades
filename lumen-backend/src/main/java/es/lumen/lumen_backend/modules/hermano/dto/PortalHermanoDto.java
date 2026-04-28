package es.lumen.lumen_backend.modules.hermano.dto;

import java.time.LocalDate;

public class PortalHermanoDto {

    private Integer id;
    private String nombreCompleto;
    private Integer numeroHermano;
    private String email;
    private String telefonoMovil;
    private String direccionCompleta;
    private String nif;
    private LocalDate fechaAlta;
    private String estado;

    public PortalHermanoDto() {
    }

    public PortalHermanoDto(Integer id, String nombreCompleto, Integer numeroHermano, String email,
                            String telefonoMovil, String direccionCompleta, String nif,
                            LocalDate fechaAlta, String estado) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.numeroHermano = numeroHermano;
        this.email = email;
        this.telefonoMovil = telefonoMovil;
        this.direccionCompleta = direccionCompleta;
        this.nif = nif;
        this.fechaAlta = fechaAlta;
        this.estado = estado;
    }

    public Integer getId() { return id; }
    public String getNombreCompleto() { return nombreCompleto; }
    public Integer getNumeroHermano() { return numeroHermano; }
    public String getEmail() { return email; }
    public String getTelefonoMovil() { return telefonoMovil; }
    public String getDireccionCompleta() { return direccionCompleta; }
    public String getNif() { return nif; }
    public LocalDate getFechaAlta() { return fechaAlta; }
    public String getEstado() { return estado; }
}
