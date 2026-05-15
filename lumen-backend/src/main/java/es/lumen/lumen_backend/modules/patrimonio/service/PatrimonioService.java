package es.lumen.lumen_backend.modules.patrimonio.service;

import java.util.List;

import es.lumen.lumen_backend.modules.patrimonio.dto.PatrimonioDto;
import es.lumen.lumen_backend.modules.patrimonio.dto.PatrimonioRequest;

public interface PatrimonioService {
    PatrimonioDto obtenerPatrimonioPorId(Integer id);
    List<PatrimonioDto> obtenerTodosLosPatrimonios();
    PatrimonioDto guardarPatrimonio(PatrimonioRequest patrimonio);
    PatrimonioDto actualizarPatrimonio(Integer id, PatrimonioRequest patrimonioDetalles);
    boolean eliminarPatrimonio(Integer id);
}
