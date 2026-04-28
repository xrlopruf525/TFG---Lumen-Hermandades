package es.lumen.lumen_backend.hermano_modulo.services.impl;

import es.lumen.lumen_backend.hermano_modulo.dto.HermanoDto;
import es.lumen.lumen_backend.hermano_modulo.dto.PortalHermanoDto;
import es.lumen.lumen_backend.hermano_modulo.models.Hermano;
import es.lumen.lumen_backend.hermano_modulo.repositories.HermanoRepository;
import es.lumen.lumen_backend.hermano_modulo.services.HermanoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HermanoServiceImpl implements HermanoService {

    private static final Logger logger = LoggerFactory.getLogger(HermanoServiceImpl.class);

    private final HermanoRepository hermanoRepository;

    public HermanoServiceImpl(HermanoRepository hermanoRepository) {
        this.hermanoRepository = hermanoRepository;
    }

    @Override
    public List<Hermano> buscarTodosActivos() {
        logger.info("Buscando todos los hermanos activos");
        return hermanoRepository.findByActivoTrue();
    }

    @Override
    public List<Hermano> buscarInactivos() {
        logger.info("Buscando hermanos inactivos");
        return hermanoRepository.findByActivoFalse();
    }

    @Override
    public Hermano buscarPorId(Long id) {
        logger.info("Buscando hermano con id {}", id);
        return hermanoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hermano no encontrado con id: " + id));
    }

    @Override
    public Hermano guardar(HermanoDto dto) {
        logger.info("Guardando nuevo hermano: {}", dto.getNombre());
        Hermano hermano = new Hermano(dto);
        return hermanoRepository.save(hermano);
    }

    @Override
    public Hermano actualizar(Long id, HermanoDto dto) {
        logger.info("Actualizando hermano con id {}", id);
        Hermano hermano = buscarPorId(id);
        hermano.actualizarDesdeDto(dto);
        return hermanoRepository.save(hermano);
    }

    @Override
    public void bajaLogica(Long id) {
        logger.info("Realizando baja lógica del hermano con id {}", id);
        Hermano hermano = buscarPorId(id);
        hermano.setActivo(false);
        hermano.setFechaBaja(LocalDate.now());
        hermanoRepository.save(hermano);
    }

    @Override
    public PortalHermanoDto obtenerDatosPortal(Long id) {
        logger.info("Obteniendo datos del portal para el hermano con id {}", id);
        Hermano hermano = buscarPorId(id);

        return construirPortalHermanoDto(hermano);
    }

    @Override
    public PortalHermanoDto obtenerDatosPortalPorEmail(String email) {
        logger.info("Obteniendo datos del portal para el usuario/email {}", email);

        Hermano hermano = hermanoRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new RuntimeException("No existe un hermano activo asociado al email: " + email));

        return construirPortalHermanoDto(hermano);
    }

    private PortalHermanoDto construirPortalHermanoDto(Hermano hermano) {
        return new PortalHermanoDto(
                hermano.getId(),
                hermano.getNombre() + " " + hermano.getApellidos(),
                hermano.getNumeroHermano(),
                hermano.getEmail(),
                hermano.getTelefono(),
                hermano.getDireccion(),
                hermano.getDni(),
                hermano.getFechaAlta(),
                hermano.getActivo()
        );
    }
}