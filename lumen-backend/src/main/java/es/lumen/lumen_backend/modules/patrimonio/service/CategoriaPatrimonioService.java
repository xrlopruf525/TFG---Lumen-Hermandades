package es.lumen.lumen_backend.modules.patrimonio.service;

import es.lumen.lumen_backend.modules.patrimonio.entity.CategoriaPatrimonio;
import java.util.List;

public interface CategoriaPatrimonioService {
    CategoriaPatrimonio obtenerCategoriaPorId(Integer id);
    List<CategoriaPatrimonio> obtenerTodasLasCategorias();
    CategoriaPatrimonio guardarCategoria(CategoriaPatrimonio categoria);
    CategoriaPatrimonio actualizarCategoria(Integer id, CategoriaPatrimonio categoriaDetalles);
    boolean eliminarCategoria(Integer id);
}
