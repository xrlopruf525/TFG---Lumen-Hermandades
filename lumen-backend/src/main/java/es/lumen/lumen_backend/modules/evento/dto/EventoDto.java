package es.lumen.lumen_backend.modules.evento.dto;

import java.time.LocalDate;

public class EventoDto {

    private Integer idEvento;
    private Integer idHermandad;
    private String titulo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String lugar;
    private String tipoEvento;
    private Boolean deleted;
    private String googleCalendarUrl;

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

    public String getGoogleCalendarUrl() {
        return googleCalendarUrl;
    }

    public void setGoogleCalendarUrl(String googleCalendarUrl) {
        this.googleCalendarUrl = googleCalendarUrl;
    }
}
