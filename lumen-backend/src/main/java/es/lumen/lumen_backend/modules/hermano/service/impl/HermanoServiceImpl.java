package es.lumen.lumen_backend.modules.hermano.service.impl;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.hermano.service.HermanoService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HermanoServiceImpl implements HermanoService {

    private final HermanoRepository hermanoRepository;

    public HermanoServiceImpl(HermanoRepository hermanoRepository) {
        this.hermanoRepository = hermanoRepository;
    }

    @Override
    public List<Hermano> buscarTodosActivos() {
        return hermanoRepository.findByDeletedFalse();
    }

    @Override
    public List<Hermano> buscarInactivos() {
        return hermanoRepository.findByDeletedTrue();
    }

    @Override
    public Hermano buscarPorId(Integer id) {
        return hermanoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hermano no encontrado con id: " + id));
    }

    @Override
    public Hermano guardar(HermanoDto dto) {
        return hermanoRepository.save(new Hermano(dto));
    }

    @Override
    public Hermano actualizar(Integer id, HermanoDto dto) {
        Hermano hermano = buscarPorId(id);
        hermano.actualizarDesdeDto(dto);
        return hermanoRepository.save(hermano);
    }

    @Override
    public void bajaLogica(Integer id) {
        Hermano hermano = buscarPorId(id);
        hermano.setDeleted(true);
        hermano.setFechaBaja(LocalDate.now());
        if (hermano.getEstado() == null || hermano.getEstado().isBlank() || "ACTIVO".equalsIgnoreCase(hermano.getEstado())) {
            hermano.setEstado("BAJA");
        }
        hermanoRepository.save(hermano);
    }

    @Override
    public PortalHermanoDto obtenerDatosPortal(Integer id) {
        Hermano hermano = buscarPorId(id);
        String apellidos = (hermano.getPrimerApellido() == null ? "" : hermano.getPrimerApellido())
                + (hermano.getSegundoApellido() == null ? "" : " " + hermano.getSegundoApellido());
        String direccionCompleta = String.join(" ",
                valor(hermano.getDireccion()),
                valor(hermano.getNumero()),
                valor(hermano.getPisoPuerta()),
                valor(hermano.getCodigoPostal()),
                valor(hermano.getPoblacion()),
                valor(hermano.getProvincia()),
                valor(hermano.getPais())).trim().replaceAll(" +", " ");

        return new PortalHermanoDto(
                hermano.getId(),
                (hermano.getNombre() + " " + apellidos).trim(),
                hermano.getNumeroHermano(),
                hermano.getEmail(),
                hermano.getTelefonoMovil(),
                direccionCompleta,
                hermano.getNif(),
                hermano.getFechaAlta(),
                hermano.getEstado()
        );
    }

    private String valor(String value) {
        return value == null ? "" : value;
    }
}
