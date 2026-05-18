package es.lumen.lumen_backend.modules.gasto.service.impl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.gasto.dto.GastoDto;
import es.lumen.lumen_backend.modules.gasto.dto.GastoRequest;
import es.lumen.lumen_backend.modules.gasto.entity.Gasto;
import es.lumen.lumen_backend.modules.gasto.repositories.GastoRepository;
import es.lumen.lumen_backend.modules.gasto.service.GastoService;

@Service
@Transactional(readOnly = true)
public class GastoServiceImpl implements GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Override
    public GastoDto obtenerGastoPorId(Integer id) {
        return toDto(buscarGastoActivoPorId(id));
    }

    @Override
    public List<GastoDto> obtenerTodosLosGastos() {
        return gastoRepository.findByDeletedFalse().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public GastoDto guardarGasto(GastoRequest gasto) {
        Gasto entidad = new Gasto();
        entidad.setConcepto(gasto.getConcepto());
        entidad.setImporte(gasto.getImporte());
        entidad.setFecha(gasto.getFecha());
        entidad.setProveedor(gasto.getProveedor());
        entidad.setDeleted(false);
        return toDto(gastoRepository.save(entidad));
    }

    @Override
    @Transactional
    public GastoDto actualizarGasto(Integer id, GastoRequest gastoDetalles) {
        Gasto gasto = buscarGastoActivoPorId(id);
        gasto.setConcepto(gastoDetalles.getConcepto());
        gasto.setImporte(gastoDetalles.getImporte());
        gasto.setFecha(gastoDetalles.getFecha());
        gasto.setProveedor(gastoDetalles.getProveedor());
        return toDto(gastoRepository.save(gasto));
    }

    @Override
    @Transactional
    public boolean eliminarGasto(Integer id) {
        Gasto gasto = buscarGastoActivoPorId(id);
        gasto.setDeleted(true);
        gastoRepository.save(gasto);
        return true;
    }

    private Gasto buscarGastoActivoPorId(Integer id) {
        Optional<Gasto> gastoOptional = gastoRepository.findById(id);
        Gasto gasto = gastoOptional.filter(valor -> Boolean.FALSE.equals(valor.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Gasto no encontrado con id: " + id));
        return gasto;
    }

    private GastoDto toDto(Gasto gasto) {
        GastoDto dto = new GastoDto();
        dto.setIdGasto(gasto.getIdGasto());
        dto.setConcepto(gasto.getConcepto());
        dto.setImporte(gasto.getImporte());
        dto.setFecha(gasto.getFecha());
        dto.setProveedor(gasto.getProveedor());
        dto.setDeleted(gasto.getDeleted());
        return dto;
    }
}