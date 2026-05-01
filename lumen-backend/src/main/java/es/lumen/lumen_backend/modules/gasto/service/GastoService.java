package es.lumen.lumen_backend.modules.gasto.service;


import es.lumen.lumen_backend.modules.gasto.entity.Gasto;
import java.util.List;

public interface GastoService {
    Gasto obtenerGastoPorId(Integer id);
    List<Gasto> obtenerTodosLosGastos();
    Gasto guardarGasto(Gasto gasto);
    Gasto actualizarGasto(Integer id, Gasto gastoDetalles);
    boolean eliminarGasto(Integer id);
}
