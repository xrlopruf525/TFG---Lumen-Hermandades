package es.lumen.lumen_backend.modules.patrimonio.service;

import java.util.List;

import es.lumen.lumen_backend.modules.patrimonio.entity.Patrimonio;

public interface PatrimonioService {
    Patrimonio obtenerPatrimonioPorId(Integer id);
    List<Patrimonio> obtenerTodosLosPatrimonios();
    Patrimonio guardarPatrimonio(Patrimonio patrimonio);
    Patrimonio actualizarPatrimonio(Integer id, Patrimonio patrimonioDetalles);
    boolean eliminarPatrimonio(Integer id);
}
