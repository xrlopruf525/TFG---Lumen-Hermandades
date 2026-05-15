package es.lumen.lumen_backend.modules.patrimonio.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.patrimonio.dto.CategoriaPatrimonioDto;
import es.lumen.lumen_backend.modules.patrimonio.dto.CategoriaPatrimonioRequest;
import es.lumen.lumen_backend.modules.patrimonio.entity.CategoriaPatrimonio;
import es.lumen.lumen_backend.modules.patrimonio.repository.CategoriaPatrimonioRepository;
import es.lumen.lumen_backend.modules.patrimonio.service.CategoriaPatrimonioService;

@Service
@Transactional(readOnly = true)
public class CategoriaPatrimonioServiceImpl implements CategoriaPatrimonioService {

    @Autowired
    private CategoriaPatrimonioRepository categoriaPatrimonioRepository;

    @Override
    public CategoriaPatrimonioDto obtenerCategoriaPorId(Integer id) {
        return toDto(buscarCategoriaActivaPorId(id));
    }

    @Override
    public List<CategoriaPatrimonioDto> obtenerTodasLasCategorias() {
        return categoriaPatrimonioRepository.findByDeletedFalse().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public CategoriaPatrimonioDto guardarCategoria(CategoriaPatrimonioRequest categoria) {
        CategoriaPatrimonio entidad = new CategoriaPatrimonio();
        entidad.setNombre(categoria.getNombre());
        entidad.setDescripcion(categoria.getDescripcion());
        entidad.setDeleted(false);
        return toDto(categoriaPatrimonioRepository.save(entidad));
    }

    @Override
    @Transactional
    public CategoriaPatrimonioDto actualizarCategoria(Integer id, CategoriaPatrimonioRequest categoriaDetalles) {
        CategoriaPatrimonio categoria = buscarCategoriaActivaPorId(id);
        categoria.setNombre(categoriaDetalles.getNombre());
        categoria.setDescripcion(categoriaDetalles.getDescripcion());
        return toDto(categoriaPatrimonioRepository.save(categoria));
    }

    @Override
    @Transactional
    public boolean eliminarCategoria(Integer id) {
        CategoriaPatrimonio categoria = buscarCategoriaActivaPorId(id);
        categoria.setDeleted(true);
        categoriaPatrimonioRepository.save(categoria);
        return true;
    }

    private CategoriaPatrimonio buscarCategoriaActivaPorId(Integer id) {
        Optional<CategoriaPatrimonio> categoriaOptional = categoriaPatrimonioRepository.findById(id);
        return categoriaOptional.filter(valor -> Boolean.FALSE.equals(valor.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Categoría de patrimonio no encontrada con id: " + id));
    }

    private CategoriaPatrimonioDto toDto(CategoriaPatrimonio categoria) {
        CategoriaPatrimonioDto dto = new CategoriaPatrimonioDto();
        dto.setIdCategoria(categoria.getIdCategoria());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        dto.setDeleted(categoria.getDeleted());
        return dto;
    }
}
