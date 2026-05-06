package es.lumen.lumen_backend.modules.patrimonio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Imagen_Patrimonio")
public class ImagenPatrimonio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen")
    private Integer idImagen;

    @Column(name = "ruta", length = 500, nullable = false)
    private String ruta;

    @Column(name = "patrimonio_id", nullable = false)
    private Integer patrimonioId;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    // Constructores
    public ImagenPatrimonio() {}

    public ImagenPatrimonio(String ruta, Integer patrimonioId) {
        this.ruta = ruta;
        this.patrimonioId = patrimonioId;
    }

    // Getters y Setters
    public Integer getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(Integer idImagen) {
        this.idImagen = idImagen;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public Integer getPatrimonioId() {
        return patrimonioId;
    }

    public void setPatrimonioId(Integer patrimonioId) {
        this.patrimonioId = patrimonioId;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
