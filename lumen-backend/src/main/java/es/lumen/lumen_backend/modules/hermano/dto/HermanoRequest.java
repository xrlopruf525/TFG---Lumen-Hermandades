package es.lumen.lumen_backend.modules.hermano.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class HermanoRequest {

    @NotNull(message = "La hermandad es obligatoria")
    private Integer idHermandad;

    private Integer numeroHermano;

    @NotBlank(message = "El DNI es obligatorio")
    @Size(max = 20, message = "El DNI no puede superar 20 caracteres")
    private String nif;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @NotBlank(message = "El primer apellido es obligatorio")
    @Size(max = 100, message = "El primer apellido no puede superar 100 caracteres")
    private String primerApellido;

    @Size(max = 100, message = "El segundo apellido no puede superar 100 caracteres")
    private String segundoApellido;

    private LocalDate fechaNacimiento;

    @Size(max = 200, message = "La dirección no puede superar 200 caracteres")
    private String direccion;

    @Size(max = 10, message = "El número no puede superar 10 caracteres")
    private String numero;

    @Size(max = 20, message = "El piso o puerta no puede superar 20 caracteres")
    private String pisoPuerta;

    @Size(max = 10, message = "El código postal no puede superar 10 caracteres")
    private String codigoPostal;

    @Size(max = 100, message = "La población no puede superar 100 caracteres")
    private String poblacion;

    @Size(max = 100, message = "La provincia no puede superar 100 caracteres")
    private String provincia;

    @Size(max = 100, message = "El país no puede superar 100 caracteres")
    private String pais;

    @Size(max = 20, message = "El teléfono móvil no puede superar 20 caracteres")
    private String telefonoMovil;

    @Size(max = 20, message = "El teléfono fijo no puede superar 20 caracteres")
    private String telefonoFijo;

    @Email(message = "El correo electrónico no tiene un formato válido")
    @Size(max = 150, message = "El correo electrónico no puede superar 150 caracteres")
    private String email;

    private LocalDate fechaAlta;

    private LocalDate fechaBaja;

    @Size(max = 20, message = "El estado no puede superar 20 caracteres")
    private String estado;

    @Size(max = 50, message = "La forma de pago no puede superar 50 caracteres")
    private String formaPago;

    @Size(max = 34, message = "El IBAN no puede superar 34 caracteres")
    private String iban;

    @Size(max = 150, message = "El titular de la cuenta no puede superar 150 caracteres")
    private String titularCuenta;

    private Boolean enCuotas;

    private String observaciones;

    @Size(max = 20, message = "El tutor legal no puede superar 20 caracteres")
    private String tutorLegal;

    public Integer getIdHermandad() {
        return idHermandad;
    }

    public void setIdHermandad(Integer idHermandad) {
        this.idHermandad = idHermandad;
    }

    public Integer getNumeroHermano() {
        return numeroHermano;
    }

    public void setNumeroHermano(Integer numeroHermano) {
        this.numeroHermano = numeroHermano;
    }

    public String getNif() {
        return nif;
    }

    public void setNif(String nif) {
        this.nif = nif;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPrimerApellido() {
        return primerApellido;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return segundoApellido;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getPisoPuerta() {
        return pisoPuerta;
    }

    public void setPisoPuerta(String pisoPuerta) {
        this.pisoPuerta = pisoPuerta;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getPoblacion() {
        return poblacion;
    }

    public void setPoblacion(String poblacion) {
        this.poblacion = poblacion;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getTelefonoMovil() {
        return telefonoMovil;
    }

    public void setTelefonoMovil(String telefonoMovil) {
        this.telefonoMovil = telefonoMovil;
    }

    public String getTelefonoFijo() {
        return telefonoFijo;
    }

    public void setTelefonoFijo(String telefonoFijo) {
        this.telefonoFijo = telefonoFijo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(String formaPago) {
        this.formaPago = formaPago;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getTitularCuenta() {
        return titularCuenta;
    }

    public void setTitularCuenta(String titularCuenta) {
        this.titularCuenta = titularCuenta;
    }

    public Boolean getEnCuotas() {
        return enCuotas;
    }

    public void setEnCuotas(Boolean enCuotas) {
        this.enCuotas = enCuotas;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getTutorLegal() {
        return tutorLegal;
    }

    public void setTutorLegal(String tutorLegal) {
        this.tutorLegal = tutorLegal;
    }
}
