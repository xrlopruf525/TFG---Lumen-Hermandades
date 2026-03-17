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
    private LocalDate fechaAlta;

    public Hermano() {}

    public Hermano(HermanoDto dto) {
        this.nombre = dto.getNombre();
        this.apellidos = dto.getApellidos();
        this.email = dto.getEmail();
        this.numeroHermano = dto.getNumeroHermano();
        this.fechaAlta = LocalDate.now();
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

    public LocalDate getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(LocalDate fechaAlta) {
        this.fechaAlta = fechaAlta;
    }
}