package es.lumen.lumen_backend.modules.grupo.dto;

import java.util.List;

public class ActualizarGrupoHermanosRequest {

    private List<Integer> idHermanos;

    public ActualizarGrupoHermanosRequest() {
    }

    public ActualizarGrupoHermanosRequest(List<Integer> idHermanos) {
        this.idHermanos = idHermanos;
    }

    public List<Integer> getIdHermanos() {
        return idHermanos;
    }

    public void setIdHermanos(List<Integer> idHermanos) {
        this.idHermanos = idHermanos;
    }
}