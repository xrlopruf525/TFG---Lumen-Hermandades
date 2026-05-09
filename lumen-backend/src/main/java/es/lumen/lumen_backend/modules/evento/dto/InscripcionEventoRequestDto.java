package es.lumen.lumen_backend.modules.evento.dto;

import java.util.List;

public class InscripcionEventoRequestDto {

    private Boolean inscribirTodos;
    private List<Integer> hermanoIds;

    public Boolean getInscribirTodos() {
        return inscribirTodos;
    }

    public void setInscribirTodos(Boolean inscribirTodos) {
        this.inscribirTodos = inscribirTodos;
    }

    public List<Integer> getHermanoIds() {
        return hermanoIds;
    }

    public void setHermanoIds(List<Integer> hermanoIds) {
        this.hermanoIds = hermanoIds;
    }
}
