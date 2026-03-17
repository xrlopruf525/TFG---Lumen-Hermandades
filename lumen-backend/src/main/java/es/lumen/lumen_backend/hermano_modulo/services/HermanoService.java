package es.lumen.lumen_backend.hermano_modulo.services;

import es.lumen.lumen_backend.hermano_modulo.models.Hermano;
import java.util.List;

public interface HermanoService {
    List<Hermano> buscarTodos();
    Hermano guardar(Hermano hermano);
    void eliminar(Long id);
}