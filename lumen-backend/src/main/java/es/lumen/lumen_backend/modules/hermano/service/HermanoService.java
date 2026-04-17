package es.lumen.lumen_backend.modules.hermano.service;

import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;

import java.util.List;

public interface HermanoService {

    List<Hermano> buscarTodosActivos();
    List<Hermano> buscarInactivos();
    Hermano buscarPorId(Integer id);
    Hermano guardar(HermanoDto dto);
    Hermano actualizar(Integer id, HermanoDto dto);
    void bajaLogica(Integer id);
    PortalHermanoDto obtenerDatosPortal(Integer id);
}
