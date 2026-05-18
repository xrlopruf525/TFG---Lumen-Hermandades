package es.lumen.lumen_backend.modules.hermano.dto;

import es.lumen.lumen_backend.modules.cuota.dto.CuotaResumenDto;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoResumenDto;
import java.time.LocalDate;
import java.util.List;

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
    private List<GrupoResumenDto> grupos;
    private List<CuotaResumenDto> cuotas;

    public PortalHermanoDto() {
    }

    public PortalHermanoDto(Integer id, String nombreCompleto, Integer numeroHermano, String email,
                            String telefonoMovil, String direccionCompleta, String nif,
                            LocalDate fechaAlta, String estado, List<GrupoResumenDto> grupos, List<CuotaResumenDto> cuotas) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.numeroHermano = numeroHermano;
        this.email = email;
        this.telefonoMovil = telefonoMovil;
        this.direccionCompleta = direccionCompleta;
        this.nif = nif;
        this.fechaAlta = fechaAlta;
        this.estado = estado;
        this.grupos = grupos;
        this.cuotas = cuotas;
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
    public List<GrupoResumenDto> getGrupos() { return grupos; }
    public List<CuotaResumenDto> getCuotas() { return cuotas; }
}
