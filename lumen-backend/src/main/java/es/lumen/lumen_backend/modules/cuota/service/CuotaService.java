package es.lumen.lumen_backend.modules.cuota.service;

import es.lumen.lumen_backend.modules.cuota.entity.Cuota;
import java.util.List;

public interface CuotaService {
    List<Cuota> obtenerTodasLasCuotas();
    List<Cuota> obtenerCuotasPorHermano(Integer idHermano);
    Cuota pagarCuota(Integer idCuota, String urlRecibo);
    void generarCuotasTrimestrales();
}
