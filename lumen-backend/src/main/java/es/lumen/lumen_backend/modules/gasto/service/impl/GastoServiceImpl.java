package es.lumen.lumen_backend.modules.gasto.service.impl;


import es.lumen.lumen_backend.modules.gasto.entity.Gasto;
import es.lumen.lumen_backend.modules.gasto.repositories.GastoRepository;
import es.lumen.lumen_backend.modules.gasto.service.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GastoServiceImpl implements GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Override
    public Gasto obtenerGastoPorId(Integer id) {
        Optional<Gasto> gastoOptional = gastoRepository.findById(id);
        return gastoOptional.orElse(null);
    }

    @Override
    public List<Gasto> obtenerTodosLosGastos() {
        return gastoRepository.findAll();
    }

    @Override
    public Gasto guardarGasto(Gasto gasto) {
        return gastoRepository.save(gasto);
    }

    @Override
    public Gasto actualizarGasto(Integer id, Gasto gastoDetalles) {
        Optional<Gasto> gastoOptional = gastoRepository.findById(id);
        if (gastoOptional.isPresent()) {
            Gasto gasto = gastoOptional.get();
            gasto.setConcepto(gastoDetalles.getConcepto());
            gasto.setImporte(gastoDetalles.getImporte());
            gasto.setFecha(gastoDetalles.getFecha());
            gasto.setProveedor(gastoDetalles.getProveedor());
            return gastoRepository.save(gasto);
        }
        return null;
    }

    @Override
    public boolean eliminarGasto(Integer id) {
        Optional<Gasto> gastoOptional = gastoRepository.findById(id);
        if (gastoOptional.isPresent()) {
            Gasto gasto = gastoOptional.get();
            gasto.setDeleted(true);
            gastoRepository.save(gasto);
            return true;
        }
        return false;
    }
}