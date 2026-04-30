package es.lumen.lumen_backend.modules.hermano.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.hermano.service.HermanoService;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;

@Service
public class HermanoServiceImpl implements HermanoService {

    private final HermanoRepository hermanoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public HermanoServiceImpl(
            HermanoRepository hermanoRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.hermanoRepository = hermanoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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
        String username = extractDniDigits(dto.getNif());

        if (usuarioRepository.findByUsername(username).isPresent()) {
            throw new IllegalStateException("Ya existe un usuario para este DNI");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(buildInitialPassword(dto.getNombre(), username)));
        usuario.setRole("HERMANO");

        Hermano hermano = new Hermano(dto);
        hermano.setUsuario(usuario);

        return hermanoRepository.save(hermano);
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

    private String extractDniDigits(String nif) {
        if (nif == null) {
            throw new IllegalArgumentException("El DNI es obligatorio");
        }

        String normalized = nif.trim().toUpperCase();
        String digits = normalized.replaceAll("\\D", "");

        if (digits.length() != 8) {
            throw new IllegalArgumentException("DNI invalido para generar usuario");
        }

        return digits;
    }

    private String buildInitialPassword(String nombre, String dniDigits) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio para generar password");
        }

        String normalizedName = nombre.trim().toLowerCase().replaceAll("[^a-z]", "");
        String namePart = normalizedName.length() >= 3
                ? normalizedName.substring(0, 3)
                : String.format("%-3s", normalizedName).replace(' ', 'x');
        String dniPart = dniDigits.substring(dniDigits.length() - 3);

        return namePart + dniPart;
    }
}
