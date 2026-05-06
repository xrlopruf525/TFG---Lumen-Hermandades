package es.lumen.lumen_backend.modules.patrimonio.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.lumen.lumen_backend.modules.patrimonio.entity.Patrimonio;
import es.lumen.lumen_backend.modules.patrimonio.repository.PatrimonioRepository;
import es.lumen.lumen_backend.modules.patrimonio.service.PatrimonioService;

@Service
public class PatrimonioServiceImpl implements PatrimonioService {

    @Autowired
    private PatrimonioRepository patrimonioRepository;

    @Override
    public Patrimonio obtenerPatrimonioPorId(Integer id) {
        Optional<Patrimonio> patrimonioOptional = patrimonioRepository.findById(id);
        return patrimonioOptional.orElse(null);
    }

    @Override
    public List<Patrimonio> obtenerTodosLosPatrimonios() {
        return patrimonioRepository.findAll();
    }

    @Override
    public Patrimonio guardarPatrimonio(Patrimonio patrimonio) {
        if (patrimonio.getEstado() == null) {
            patrimonio.setEstado("bueno");
        }
        patrimonio.setImagenUrl(normalizarImagenUrl(patrimonio.getImagenUrl()));
        return patrimonioRepository.save(patrimonio);
    }

    @Override
    public Patrimonio actualizarPatrimonio(Integer id, Patrimonio patrimonioDetalles) {
        Optional<Patrimonio> patrimonioOptional = patrimonioRepository.findById(id);
        if (patrimonioOptional.isPresent()) {
            Patrimonio patrimonio = patrimonioOptional.get();
            patrimonio.setNombre(patrimonioDetalles.getNombre());
            patrimonio.setDescripcion(patrimonioDetalles.getDescripcion());
            patrimonio.setCategoria(patrimonioDetalles.getCategoria());
            patrimonio.setEstado(patrimonioDetalles.getEstado());
            patrimonio.setUbicacion(patrimonioDetalles.getUbicacion());
            patrimonio.setFechaAdquisicion(patrimonioDetalles.getFechaAdquisicion());
            patrimonio.setValorEstimado(patrimonioDetalles.getValorEstimado());
            patrimonio.setImagenUrl(normalizarImagenUrl(patrimonioDetalles.getImagenUrl()));
            return patrimonioRepository.save(patrimonio);
        }
        return null;
    }

    @Override
    public boolean eliminarPatrimonio(Integer id) {
        Optional<Patrimonio> patrimonioOptional = patrimonioRepository.findById(id);
        if (patrimonioOptional.isPresent()) {
            Patrimonio patrimonio = patrimonioOptional.get();
            patrimonio.setDeleted(true);
            patrimonioRepository.save(patrimonio);
            return true;
        }
        return false;
    }

    private String normalizarImagenUrl(String imagenUrl) {
        if (imagenUrl == null) {
            return null;
        }

        String valor = imagenUrl.trim();
        return valor.isEmpty() ? null : valor;
    }
}
