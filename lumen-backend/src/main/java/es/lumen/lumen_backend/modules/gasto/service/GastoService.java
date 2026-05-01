package es.lumen.lumen_backend.modules.gasto.service;


import java.util.List;
import es.lumen.lumen_backend.modules.gasto.entity.Gasto;

public interface GastoService {
    List<Gasto> obtenerGastosPorHermandad(Integer idHermandad);
    Gasto guardarGasto(Gasto gasto);
    Gasto actualizarGasto(Integer id, Gasto gastoDetalles);
    boolean eliminarGasto(Integer id);
}
