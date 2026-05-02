package es.lumen.lumen_backend.modules.hermano.dto;

import java.util.ArrayList;
import java.util.List;

public class ImportarHermanosResponse {

    private int totalLeidos;
    private int importados;
    private int errores;
    private List<String> detalleErrores = new ArrayList<>();

    public ImportarHermanosResponse() {
    }

    public ImportarHermanosResponse(int totalLeidos, int importados, int errores, List<String> detalleErrores) {
        this.totalLeidos = totalLeidos;
        this.importados = importados;
        this.errores = errores;
        this.detalleErrores = detalleErrores;
    }

    public int getTotalLeidos() {
        return totalLeidos;
    }

    public void setTotalLeidos(int totalLeidos) {
        this.totalLeidos = totalLeidos;
    }

    public int getImportados() {
        return importados;
    }

    public void setImportados(int importados) {
        this.importados = importados;
    }

    public int getErrores() {
        return errores;
    }

    public void setErrores(int errores) {
        this.errores = errores;
    }

    public List<String> getDetalleErrores() {
        return detalleErrores;
    }

    public void setDetalleErrores(List<String> detalleErrores) {
        this.detalleErrores = detalleErrores;
    }
}