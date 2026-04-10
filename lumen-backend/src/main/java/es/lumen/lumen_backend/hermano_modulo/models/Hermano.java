package es.lumen.lumen_backend.hermano_modulo.models;

import es.lumen.lumen_backend.hermano_modulo.dto.HermanoDto;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "hermanos")
public class Hermano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellidos;
    private String email;
    private String numeroHermano;
    private String telefono;
    private String direccion;
    private String dni;

    private LocalDate fechaAlta;
    private LocalDate fechaBaja;

    private Boolean activo;

    public Hermano() {
    }

    public Hermano(HermanoDto dto) {
        this.nombre = dto.getNombre();
        this.apellidos = dto.getApellidos();
        this.email = dto.getEmail();
        this.numeroHermano = dto.getNumeroHermano();
        this.telefono = dto.getTelefono();
        this.direccion = dto.getDireccion();
        this.dni = dto.getDni();
        this.fechaAlta = LocalDate.now();
        this.activo = true;
    }

    public void actualizarDesdeDto(HermanoDto dto) {
        this.nombre = dto.getNombre();
        this.apellidos = dto.getApellidos();
        this.email = dto.getEmail();
        this.numeroHermano = dto.getNumeroHermano();
        this.telefono = dto.getTelefono();
        this.direccion = dto.getDireccion();
        this.dni = dto.getDni();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(LocalDate fechaAlta) {
        this.fechaAlta = fechaAlta;
    }

    public LocalDate getFechaBaja() {
        return fechaBaja;
    }

    public void setFechaBaja(LocalDate fechaBaja) {
        this.fechaBaja = fechaBaja;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}