package es.lumen.lumen_backend.modules.patrimonio.service;

import java.util.List;

import es.lumen.lumen_backend.modules.patrimonio.dto.CategoriaPatrimonioDto;
import es.lumen.lumen_backend.modules.patrimonio.dto.CategoriaPatrimonioRequest;

public interface CategoriaPatrimonioService {
    CategoriaPatrimonioDto obtenerCategoriaPorId(Integer id);
    List<CategoriaPatrimonioDto> obtenerTodasLasCategorias();
    CategoriaPatrimonioDto guardarCategoria(CategoriaPatrimonioRequest categoria);
    CategoriaPatrimonioDto actualizarCategoria(Integer id, CategoriaPatrimonioRequest categoriaDetalles);
    boolean eliminarCategoria(Integer id);
}
