package es.lumen.lumen_backend.modules.patrimonio.service;

import es.lumen.lumen_backend.modules.patrimonio.entity.Patrimonio;
import java.util.List;

public interface PatrimonioService {
    Patrimonio obtenerPatrimonioPorId(Integer id);
    List<Patrimonio> obtenerTodosLosPatrimonios();
    Patrimonio guardarPatrimonio(Patrimonio patrimonio);
    Patrimonio actualizarPatrimonio(Integer id, Patrimonio patrimonioDetalles);
    boolean eliminarPatrimonio(Integer id);
}
