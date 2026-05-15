package es.lumen.lumen_backend.modules.hermano.service;

import java.util.List;

import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.HermanoRequest;
import es.lumen.lumen_backend.modules.hermano.dto.ImportarHermanosResponse;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;

public interface HermanoService {

    List<HermanoDto> buscarTodosActivos();
    List<HermanoDto> buscarInactivos();
    List<HermanoDto> buscarActivosPorTexto(String texto);
    HermanoDto buscarPorId(Integer id);
    HermanoDto guardar(HermanoRequest request);
    HermanoDto actualizar(Integer id, HermanoRequest request);
    void bajaLogica(Integer id);
    PortalHermanoDto obtenerDatosPortal(Integer id);
    ImportarHermanosResponse importarHermanos(List<HermanoRequest> hermanos);
}
