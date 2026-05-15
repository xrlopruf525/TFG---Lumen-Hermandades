package es.lumen.lumen_backend.modules.grupo.service;

import es.lumen.lumen_backend.modules.grupo.dto.ActualizarGrupoHermanosRequest;
import es.lumen.lumen_backend.modules.grupo.dto.CrearGrupoRequest;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoDetalleDto;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoResumenDto;

import java.util.List;

public interface GrupoService {

    List<GrupoResumenDto> listarGrupos();

    GrupoDetalleDto obtenerGrupo(Integer idGrupo);

    GrupoDetalleDto crearGrupo(CrearGrupoRequest request);

    GrupoDetalleDto actualizarGrupo(Integer idGrupo, CrearGrupoRequest request);

    GrupoDetalleDto actualizarHermanos(Integer idGrupo, ActualizarGrupoHermanosRequest request);
}