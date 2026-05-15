package es.lumen.lumen_backend.modules.gasto.service;


import java.util.List;

import es.lumen.lumen_backend.modules.gasto.dto.GastoDto;
import es.lumen.lumen_backend.modules.gasto.dto.GastoRequest;

public interface GastoService {
    GastoDto obtenerGastoPorId(Integer id);
    List<GastoDto> obtenerTodosLosGastos();
    GastoDto guardarGasto(GastoRequest gasto);
    GastoDto actualizarGasto(Integer id, GastoRequest gastoDetalles);
    boolean eliminarGasto(Integer id);
}
