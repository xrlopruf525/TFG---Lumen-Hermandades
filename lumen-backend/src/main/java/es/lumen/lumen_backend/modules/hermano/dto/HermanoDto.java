package es.lumen.lumen_backend.modules.hermano.dto;

import java.time.LocalDate;

public class HermanoDto {

    private Integer idHermandad;
    private Integer numeroHermano;
    private String nif;
    private String nombre;
    private String primerApellido;
    private String segundoApellido;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String numero;
    private String pisoPuerta;
    private String codigoPostal;
    private String poblacion;
    private String provincia;
    private String pais;
    private String telefonoMovil;
    private String telefonoFijo;
    private String email;
    private LocalDate fechaAlta;
    private LocalDate fechaBaja;
    private String estado;
    private String formaPago;
    private String iban;
    private String titularCuenta;
    private Boolean enCuotas;
    private String observaciones;
    private String tutorLegal;
    private Boolean deleted;

    public Integer getIdHermandad() { return idHermandad; }
    public void setIdHermandad(Integer idHermandad) { this.idHermandad = idHermandad; }
    public Integer getNumeroHermano() { return numeroHermano; }
    public void setNumeroHermano(Integer numeroHermano) { this.numeroHermano = numeroHermano; }
    public String getNif() { return nif; }
    public void setNif(String nif) { this.nif = nif; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getPrimerApellido() { return primerApellido; }
    public void setPrimerApellido(String primerApellido) { this.primerApellido = primerApellido; }
    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getPisoPuerta() { return pisoPuerta; }
    public void setPisoPuerta(String pisoPuerta) { this.pisoPuerta = pisoPuerta; }
    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }
    public String getPoblacion() { return poblacion; }
    public void setPoblacion(String poblacion) { this.poblacion = poblacion; }
    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }
    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }
    public String getTelefonoMovil() { return telefonoMovil; }
    public void setTelefonoMovil(String telefonoMovil) { this.telefonoMovil = telefonoMovil; }
    public String getTelefonoFijo() { return telefonoFijo; }
    public void setTelefonoFijo(String telefonoFijo) { this.telefonoFijo = telefonoFijo; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDate getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(LocalDate fechaAlta) { this.fechaAlta = fechaAlta; }
    public LocalDate getFechaBaja() { return fechaBaja; }
    public void setFechaBaja(LocalDate fechaBaja) { this.fechaBaja = fechaBaja; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getFormaPago() { return formaPago; }
    public void setFormaPago(String formaPago) { this.formaPago = formaPago; }
    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
    public String getTitularCuenta() { return titularCuenta; }
    public void setTitularCuenta(String titularCuenta) { this.titularCuenta = titularCuenta; }
    public Boolean getEnCuotas() { return enCuotas; }
    public void setEnCuotas(Boolean enCuotas) { this.enCuotas = enCuotas; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    public String getTutorLegal() { return tutorLegal; }
    public void setTutorLegal(String tutorLegal) { this.tutorLegal = tutorLegal; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
