package es.lumen.lumen_backend.modules.hermano.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "hermano")
public class Hermano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hermano")
    private Integer id;

    @Column(name = "id_hermandad", nullable = false)
    private Integer idHermandad;

    @Column(name = "numero_hermano", unique = true)
    private Integer numeroHermano;

    @Column(name = "nif", nullable = false, unique = true, length = 20)
    private String nif;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "primer_apellido", nullable = false, length = 100)
    private String primerApellido;

    @Column(name = "segundo_apellido", length = 100)
    private String segundoApellido;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "direccion", length = 200)
    private String direccion;

    @Column(name = "numero", length = 50)
    private String numero;

    @Column(name = "piso_puerta", length = 20)
    private String pisoPuerta;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @Column(name = "poblacion", length = 100)
    private String poblacion;

    @Column(name = "provincia", length = 100)
    private String provincia;

    @Column(name = "pais", length = 100)
    private String pais;

    @Column(name = "telefono_movil", length = 20)
    private String telefonoMovil;

    @Column(name = "telefono_fijo", length = 20)
    private String telefonoFijo;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "fecha_alta")
    private LocalDate fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDate fechaBaja;

    @Column(name = "estado", length = 20)
    private String estado;

    @Column(name = "forma_pago", length = 50)
    private String formaPago;

    @Column(name = "iban", length = 34)
    private String iban;

    @Column(name = "titular_cuenta", length = 150)
    private String titularCuenta;

    @Column(name = "en_cuotas")
    private Boolean enCuotas;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "tutor_legal", length = 20)
    private String tutorLegal;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", unique = true)
    private Usuario usuario;

    public Hermano() {
    }

    public Hermano(HermanoDto dto) {
        actualizarDesdeDto(dto);
        if (this.fechaAlta == null) {
            this.fechaAlta = LocalDate.now();
        }
        if (this.estado == null || this.estado.isBlank()) {
            this.estado = "ACTIVO";
        }
        if (this.deleted == null) {
            this.deleted = false;
        }
    }

    public void actualizarDesdeDto(HermanoDto dto) {
        this.idHermandad = dto.getIdHermandad();
        this.numeroHermano = dto.getNumeroHermano();
        this.nif = dto.getNif();
        this.nombre = dto.getNombre();
        this.primerApellido = dto.getPrimerApellido();
        this.segundoApellido = dto.getSegundoApellido();
        this.fechaNacimiento = dto.getFechaNacimiento();
        this.direccion = dto.getDireccion();
        this.numero = dto.getNumero();
        this.pisoPuerta = dto.getPisoPuerta();
        this.codigoPostal = dto.getCodigoPostal();
        this.poblacion = dto.getPoblacion();
        this.provincia = dto.getProvincia();
        this.pais = dto.getPais();
        this.telefonoMovil = dto.getTelefonoMovil();
        this.telefonoFijo = dto.getTelefonoFijo();
        this.email = dto.getEmail();
        this.fechaAlta = dto.getFechaAlta() != null ? dto.getFechaAlta() : this.fechaAlta;
        this.fechaBaja = dto.getFechaBaja();
        this.estado = dto.getEstado();
        this.formaPago = dto.getFormaPago();
        this.iban = dto.getIban();
        this.titularCuenta = dto.getTitularCuenta();
        this.enCuotas = dto.getEnCuotas();
        this.observaciones = dto.getObservaciones();
        this.tutorLegal = dto.getTutorLegal();
        this.deleted = dto.getDeleted() != null ? dto.getDeleted() : Boolean.FALSE;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
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
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
