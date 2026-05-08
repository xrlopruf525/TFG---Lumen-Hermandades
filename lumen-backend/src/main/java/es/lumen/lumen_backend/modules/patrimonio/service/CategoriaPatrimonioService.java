package es.lumen.lumen_backend.modules.patrimonio.service;

import java.util.List;

import es.lumen.lumen_backend.modules.patrimonio.entity.CategoriaPatrimonio;

public interface CategoriaPatrimonioService {
    CategoriaPatrimonio obtenerCategoriaPorId(Integer id);
    List<CategoriaPatrimonio> obtenerTodasLasCategorias();
    CategoriaPatrimonio guardarCategoria(CategoriaPatrimonio categoria);
    CategoriaPatrimonio actualizarCategoria(Integer id, CategoriaPatrimonio categoriaDetalles);
    boolean eliminarCategoria(Integer id);
}
