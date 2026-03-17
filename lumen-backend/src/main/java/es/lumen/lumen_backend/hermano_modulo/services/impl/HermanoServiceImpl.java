package es.lumen.lumen_backend.hermano_modulo.services.impl;

import es.lumen.lumen_backend.hermano_modulo.models.Hermano;
import es.lumen.lumen_backend.hermano_modulo.repositories.HermanoRepository;
import es.lumen.lumen_backend.hermano_modulo.services.HermanoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HermanoServiceImpl implements HermanoService {
    private static final Logger logger = LoggerFactory.getLogger(HermanoServiceImpl.class);

    @Autowired
    private HermanoRepository hermanoRepository;

    @Override
    public List<Hermano> buscarTodos() {
        logger.info("Buscando todos los hermanos");
        return hermanoRepository.findAll();
    }

    @Override
    public Hermano guardar(Hermano hermano) {
        logger.info("Guardando hermano: {}", hermano.getNombre());
        return hermanoRepository.save(hermano);
    }

    @Override
    public void eliminar(Long id) {
        logger.info("Eliminando hermano con id: {}", id);
        hermanoRepository.deleteById(id);
    }
}