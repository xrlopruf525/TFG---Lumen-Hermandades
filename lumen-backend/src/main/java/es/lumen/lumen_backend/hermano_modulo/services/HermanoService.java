package es.lumen.lumen_backend.hermano_modulo.services;

import es.lumen.lumen_backend.hermano_modulo.dto.HermanoDto;
import es.lumen.lumen_backend.hermano_modulo.dto.PortalHermanoDto;
import es.lumen.lumen_backend.hermano_modulo.models.Hermano;

import java.util.List;

public interface HermanoService {

    List<Hermano> buscarTodosActivos();

    List<Hermano> buscarInactivos();

    Hermano buscarPorId(Long id);

    Hermano guardar(HermanoDto dto);

    Hermano actualizar(Long id, HermanoDto dto);

    void bajaLogica(Long id);

    PortalHermanoDto obtenerDatosPortal(Long id);

    PortalHermanoDto obtenerDatosPortalPorEmail(String email);
}