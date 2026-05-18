package es.lumen.lumen_backend.modules.cuota.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Cuota")
public class Cuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuota")
    private Integer idCuota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_hermano", nullable = false)
    private Hermano hermano;

    @Column(name = "anyo", nullable = false)
    private Integer anyo;

    @Column(name = "concepto", nullable = false, length = 150)
    private String concepto;

    @Column(name = "importe", nullable = false, precision = 10, scale = 2)
    private BigDecimal importe;

    @Column(name = "estado", length = 20)
    private String estado;

    @Column(name = "fecha_pago")
    private LocalDate fechaPago;

    @Column(name = "url_recibo", length = 255)
    private String urlRecibo;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    public Cuota() {}

    public Integer getIdCuota() { return idCuota; }
    public void setIdCuota(Integer idCuota) { this.idCuota = idCuota; }
    public Hermano getHermano() { return hermano; }
    public void setHermano(Hermano hermano) { this.hermano = hermano; }
    public Integer getAnyo() { return anyo; }
    public void setAnyo(Integer anyo) { this.anyo = anyo; }
    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }
    public BigDecimal getImporte() { return importe; }
    public void setImporte(BigDecimal importe) { this.importe = importe; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDate getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDate fechaPago) { this.fechaPago = fechaPago; }
    public String getUrlRecibo() { return urlRecibo; }
    public void setUrlRecibo(String urlRecibo) { this.urlRecibo = urlRecibo; }
    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
