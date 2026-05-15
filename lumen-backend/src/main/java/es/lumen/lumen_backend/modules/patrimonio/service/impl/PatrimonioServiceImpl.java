package es.lumen.lumen_backend.modules.patrimonio.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.patrimonio.dto.PatrimonioDto;
import es.lumen.lumen_backend.modules.patrimonio.dto.PatrimonioRequest;
import es.lumen.lumen_backend.modules.patrimonio.entity.Patrimonio;
import es.lumen.lumen_backend.modules.patrimonio.repository.PatrimonioRepository;
import es.lumen.lumen_backend.modules.patrimonio.service.PatrimonioService;

@Service
@Transactional(readOnly = true)
public class PatrimonioServiceImpl implements PatrimonioService {

    @Autowired
    private PatrimonioRepository patrimonioRepository;

    @Override
    public PatrimonioDto obtenerPatrimonioPorId(Integer id) {
        return toDto(buscarPatrimonioActivoPorId(id));
    }

    @Override
    public List<PatrimonioDto> obtenerTodosLosPatrimonios() {
        return patrimonioRepository.findByDeletedFalse().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public PatrimonioDto guardarPatrimonio(PatrimonioRequest patrimonio) {
        Patrimonio entidad = new Patrimonio();
        entidad.setNombre(patrimonio.getNombre());
        entidad.setDescripcion(patrimonio.getDescripcion());
        entidad.setCategoria(patrimonio.getCategoria());
        entidad.setEstado(patrimonio.getEstado() == null ? "bueno" : patrimonio.getEstado());
        entidad.setUbicacion(patrimonio.getUbicacion());
        entidad.setFechaAdquisicion(patrimonio.getFechaAdquisicion());
        entidad.setValorEstimado(patrimonio.getValorEstimado());
        entidad.setImagenUrl(normalizarImagenUrl(patrimonio.getImagenUrl()));
        entidad.setDeleted(false);
        return toDto(patrimonioRepository.save(entidad));
    }

    @Override
    @Transactional
    public PatrimonioDto actualizarPatrimonio(Integer id, PatrimonioRequest patrimonioDetalles) {
        Patrimonio patrimonio = buscarPatrimonioActivoPorId(id);
        patrimonio.setNombre(patrimonioDetalles.getNombre());
        patrimonio.setDescripcion(patrimonioDetalles.getDescripcion());
        patrimonio.setCategoria(patrimonioDetalles.getCategoria());
        patrimonio.setEstado(patrimonioDetalles.getEstado() == null ? patrimonio.getEstado() : patrimonioDetalles.getEstado());
        patrimonio.setUbicacion(patrimonioDetalles.getUbicacion());
        patrimonio.setFechaAdquisicion(patrimonioDetalles.getFechaAdquisicion());
        patrimonio.setValorEstimado(patrimonioDetalles.getValorEstimado());
        patrimonio.setImagenUrl(normalizarImagenUrl(patrimonioDetalles.getImagenUrl()));
        return toDto(patrimonioRepository.save(patrimonio));
    }

    @Override
    @Transactional
    public boolean eliminarPatrimonio(Integer id) {
        Patrimonio patrimonio = buscarPatrimonioActivoPorId(id);
        patrimonio.setDeleted(true);
        patrimonioRepository.save(patrimonio);
        return true;
    }

    private Patrimonio buscarPatrimonioActivoPorId(Integer id) {
        Optional<Patrimonio> patrimonioOptional = patrimonioRepository.findById(id);
        return patrimonioOptional.filter(valor -> Boolean.FALSE.equals(valor.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Patrimonio no encontrado con id: " + id));
    }

    private PatrimonioDto toDto(Patrimonio patrimonio) {
        PatrimonioDto dto = new PatrimonioDto();
        dto.setIdPatrimonio(patrimonio.getIdPatrimonio());
        dto.setNombre(patrimonio.getNombre());
        dto.setDescripcion(patrimonio.getDescripcion());
        dto.setCategoria(patrimonio.getCategoria());
        dto.setEstado(patrimonio.getEstado());
        dto.setUbicacion(patrimonio.getUbicacion());
        dto.setFechaAdquisicion(patrimonio.getFechaAdquisicion());
        dto.setValorEstimado(patrimonio.getValorEstimado());
        dto.setImagenUrl(patrimonio.getImagenUrl());
        dto.setDeleted(patrimonio.getDeleted());
        return dto;
    }

    private String normalizarImagenUrl(String imagenUrl) {
        if (imagenUrl == null) {
            return null;
        }

        String valor = imagenUrl.trim();
        return valor.isEmpty() ? null : valor;
    }
}
