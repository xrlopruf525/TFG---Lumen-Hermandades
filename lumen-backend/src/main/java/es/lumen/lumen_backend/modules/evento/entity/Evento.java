package es.lumen.lumen_backend.modules.evento.entity;

import java.time.LocalDate;

import es.lumen.lumen_backend.modules.evento.dto.EventoDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Evento")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Integer idEvento;

    @Column(name = "id_hermandad", nullable = false)
    private Integer idHermandad;

    @Column(name = "titulo", length = 255)
    private String titulo;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "lugar", length = 255)
    private String lugar;

    @Column(name = "tipo_evento", length = 255)
    private String tipoEvento;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    public Evento() {
    }

    public Evento(EventoDto dto) {
        actualizarDesdeDto(dto);
        if (this.deleted == null) {
            this.deleted = false;
        }
    }

    public void actualizarDesdeDto(EventoDto dto) {
        this.idHermandad = dto.getIdHermandad();
        this.titulo = dto.getTitulo();
        this.fechaInicio = dto.getFechaInicio();
        this.fechaFin = dto.getFechaFin();
        this.lugar = dto.getLugar();
        this.tipoEvento = dto.getTipoEvento();
        this.deleted = dto.getDeleted() != null ? dto.getDeleted() : Boolean.FALSE;
    }

    public Integer getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
    }

    public Integer getIdHermandad() {
        return idHermandad;
    }

    public void setIdHermandad(Integer idHermandad) {
        this.idHermandad = idHermandad;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public String getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(String tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
