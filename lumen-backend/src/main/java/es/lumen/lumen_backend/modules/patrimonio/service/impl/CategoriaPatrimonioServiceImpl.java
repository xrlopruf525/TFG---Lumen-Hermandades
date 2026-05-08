package es.lumen.lumen_backend.modules.patrimonio.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.lumen.lumen_backend.modules.patrimonio.entity.CategoriaPatrimonio;
import es.lumen.lumen_backend.modules.patrimonio.repository.CategoriaPatrimonioRepository;
import es.lumen.lumen_backend.modules.patrimonio.service.CategoriaPatrimonioService;

@Service
public class CategoriaPatrimonioServiceImpl implements CategoriaPatrimonioService {

    @Autowired
    private CategoriaPatrimonioRepository categoriaPatrimonioRepository;

    @Override
    public CategoriaPatrimonio obtenerCategoriaPorId(Integer id) {
        Optional<CategoriaPatrimonio> categoriaOptional = categoriaPatrimonioRepository.findById(id);
        return categoriaOptional.orElse(null);
    }

    @Override
    public List<CategoriaPatrimonio> obtenerTodasLasCategorias() {
        return categoriaPatrimonioRepository.findAll();
    }

    @Override
    public CategoriaPatrimonio guardarCategoria(CategoriaPatrimonio categoria) {
        return categoriaPatrimonioRepository.save(categoria);
    }

    @Override
    public CategoriaPatrimonio actualizarCategoria(Integer id, CategoriaPatrimonio categoriaDetalles) {
        Optional<CategoriaPatrimonio> categoriaOptional = categoriaPatrimonioRepository.findById(id);
        if (categoriaOptional.isPresent()) {
            CategoriaPatrimonio categoria = categoriaOptional.get();
            categoria.setNombre(categoriaDetalles.getNombre());
            categoria.setDescripcion(categoriaDetalles.getDescripcion());
            return categoriaPatrimonioRepository.save(categoria);
        }
        return null;
    }

    @Override
    public boolean eliminarCategoria(Integer id) {
        Optional<CategoriaPatrimonio> categoriaOptional = categoriaPatrimonioRepository.findById(id);
        if (categoriaOptional.isPresent()) {
            CategoriaPatrimonio categoria = categoriaOptional.get();
            categoria.setDeleted(true);
            categoriaPatrimonioRepository.save(categoria);
            return true;
        }
        return false;
    }
}
