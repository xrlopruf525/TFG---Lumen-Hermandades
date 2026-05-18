package es.lumen.lumen_backend.modules.cuota.service;

import java.util.List;

import es.lumen.lumen_backend.modules.cuota.dto.CuotaDto;

public interface CuotaService {
    List<CuotaDto> obtenerTodasLasCuotas();
    List<CuotaDto> obtenerCuotasPorHermano(Integer idHermano);
    CuotaDto pagarCuota(Integer idCuota, String urlRecibo);
    void generarCuotasTrimestrales();
}
