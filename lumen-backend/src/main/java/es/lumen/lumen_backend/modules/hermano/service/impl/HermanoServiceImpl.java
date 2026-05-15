package es.lumen.lumen_backend.modules.hermano.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.cuota.dto.CuotaResumenDto;
import es.lumen.lumen_backend.modules.cuota.entity.Cuota;
import es.lumen.lumen_backend.modules.cuota.repositories.CuotaRepository;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoResumenDto;
import es.lumen.lumen_backend.modules.grupo.repository.GrupoRepository;
import es.lumen.lumen_backend.modules.hermano.dto.HermanoDto;
import es.lumen.lumen_backend.modules.hermano.dto.HermanoRequest;
import es.lumen.lumen_backend.modules.hermano.dto.ImportarHermanosResponse;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.hermano.service.HermanoService;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupo;
import es.lumen.lumen_backend.modules.relaciones.repository.HermanoGrupoRepository;
import es.lumen.lumen_backend.modules.rol.entity.Rol;
import es.lumen.lumen_backend.modules.rol.repository.RolRepository;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRol;
import es.lumen.lumen_backend.modules.usuario.entity.UsuarioRolId;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRolRepository;

@Service
@Transactional(readOnly = true)
public class HermanoServiceImpl implements HermanoService {

    private final HermanoRepository hermanoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final HermanoGrupoRepository hermanoGrupoRepository;
    private final GrupoRepository grupoRepository;

    public HermanoServiceImpl(
            HermanoRepository hermanoRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            RolRepository rolRepository,
            UsuarioRolRepository usuarioRolRepository,
            HermanoGrupoRepository hermanoGrupoRepository,
            GrupoRepository grupoRepository
    ) {
        this.hermanoRepository = hermanoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.rolRepository = rolRepository;
        this.usuarioRolRepository = usuarioRolRepository;
        this.hermanoGrupoRepository = hermanoGrupoRepository;
        this.grupoRepository = grupoRepository;
    }

    @Override
    public List<HermanoDto> buscarTodosActivos() {
        return hermanoRepository.findByDeletedFalse().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<HermanoDto> buscarInactivos() {
        return hermanoRepository.findByDeletedTrue().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<HermanoDto> buscarActivosPorTexto(String texto) {
        String termino = texto == null ? "" : texto.trim();
        if (termino.isEmpty()) {
            return List.of();
        }

        return hermanoRepository.buscarActivosPorTexto(termino).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public HermanoDto buscarPorId(Integer id) {
        return toDto(buscarHermanoActivoPorId(id));
    }

    @Override
    @Transactional
    public HermanoDto guardar(HermanoRequest request) {
        String username = extractDniDigits(request.getNif());

        if (usuarioRepository.findByUsername(username).isPresent()) {
            throw new IllegalStateException("Ya existe un usuario para este DNI");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(buildInitialPassword(request.getNombre(), username)));
        usuario.setRole("HERMANO");

        Hermano hermano = new Hermano(request);
        hermano.setUsuario(usuario);

        Hermano saved = hermanoRepository.save(hermano);

        Rol rolHermano = rolRepository.findAll().stream()
            .filter(r -> "HERMANO".equalsIgnoreCase(r.getNombreRol()))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("Rol HERMANO no encontrado"));

        UsuarioRolId urId = new UsuarioRolId(saved.getUsuario().getId(), rolHermano.getId());
        if (!usuarioRolRepository.existsByIdAndDeletedFalse(urId)) {
            UsuarioRol ur = new UsuarioRol();
            ur.setId(urId);
            ur.setUsuario(saved.getUsuario());
            ur.setRol(rolHermano);
            ur.setFechaAsignacion(java.time.LocalDateTime.now());
            ur.setDeleted(false);
            usuarioRolRepository.save(ur);
        }

        return toDto(saved);
    }

    @Override
    @Transactional
    public HermanoDto actualizar(Integer id, HermanoRequest request) {
        Hermano hermano = buscarHermanoActivoPorId(id);
        hermano.actualizarDesdeRequest(request);
        return toDto(hermanoRepository.save(hermano));
    }

    @Override
    @Transactional
    public void bajaLogica(Integer id) {
        Hermano hermano = buscarHermanoActivoPorId(id);
        hermano.setDeleted(true);
        hermano.setFechaBaja(LocalDate.now());
        if (hermano.getEstado() == null || hermano.getEstado().isBlank() || "ACTIVO".equalsIgnoreCase(hermano.getEstado())) {
            hermano.setEstado("BAJA");
        }
        hermanoRepository.save(hermano);
    }

    @Override
    public PortalHermanoDto obtenerDatosPortal(Integer id) {
        Hermano hermano = buscarHermanoActivoPorId(id);
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

        // Obtener los grupos del hermano
        List<HermanoGrupo> relacionesGrupos = hermanoGrupoRepository.findByIdIdHermanoAndDeletedFalse(hermano.getId());
        List<GrupoResumenDto> grupos = relacionesGrupos.stream()
                .map(hg -> grupoRepository.findById(hg.getId().getIdGrupo())
                        .map(grupo -> new GrupoResumenDto(
                                grupo.getId(),
                                grupo.getNombre(),
                                hermanoGrupoRepository.countByIdIdGrupoAndDeletedFalse(grupo.getId())
                        ))
                        .orElse(null))
                .filter(g -> g != null)
                .collect(Collectors.toList());

        return new PortalHermanoDto(
                hermano.getId(),
                (hermano.getNombre() + " " + apellidos).trim(),
                hermano.getNumeroHermano(),
                hermano.getEmail(),
                hermano.getTelefonoMovil(),
                direccionCompleta,
                hermano.getNif(),
                hermano.getFechaAlta(),
                hermano.getEstado(),
                grupos
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

    @Override
    @Transactional
    public ImportarHermanosResponse importarHermanos(List<HermanoRequest> hermanos) {
        ImportarHermanosResponse response = new ImportarHermanosResponse();
        response.setTotalLeidos(hermanos.size());
        int importados = 0;
        int errores = 0;
        List<String> detalleErrores = new ArrayList<>();

        for (HermanoRequest hermanoRequest : hermanos) {
            try {
                guardar(hermanoRequest);
                importados++;
            } catch (Exception e) {
                errores++;
                detalleErrores.add("Error al importar hermano: " + hermanoRequest.getNombre() + " - " + e.getMessage());
            }
        }

        response.setImportados(importados);
        response.setErrores(errores);
        response.setDetalleErrores(detalleErrores);
        return response;
    }

    private Hermano buscarHermanoActivoPorId(Integer id) {
        return hermanoRepository.findById(id)
                .filter(hermano -> Boolean.FALSE.equals(hermano.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Hermano no encontrado con id: " + id));
    }

    private HermanoDto toDto(Hermano hermano) {
        HermanoDto dto = new HermanoDto();
        dto.setId(hermano.getId());
        dto.setIdHermandad(hermano.getIdHermandad());
        dto.setNumeroHermano(hermano.getNumeroHermano());
        dto.setNif(hermano.getNif());
        dto.setNombre(hermano.getNombre());
        dto.setPrimerApellido(hermano.getPrimerApellido());
        dto.setSegundoApellido(hermano.getSegundoApellido());
        dto.setFechaNacimiento(hermano.getFechaNacimiento());
        dto.setDireccion(hermano.getDireccion());
        dto.setNumero(hermano.getNumero());
        dto.setPisoPuerta(hermano.getPisoPuerta());
        dto.setCodigoPostal(hermano.getCodigoPostal());
        dto.setPoblacion(hermano.getPoblacion());
        dto.setProvincia(hermano.getProvincia());
        dto.setPais(hermano.getPais());
        dto.setTelefonoMovil(hermano.getTelefonoMovil());
        dto.setTelefonoFijo(hermano.getTelefonoFijo());
        dto.setEmail(hermano.getEmail());
        dto.setFechaAlta(hermano.getFechaAlta());
        dto.setFechaBaja(hermano.getFechaBaja());
        dto.setEstado(hermano.getEstado());
        dto.setFormaPago(hermano.getFormaPago());
        dto.setIban(hermano.getIban());
        dto.setTitularCuenta(hermano.getTitularCuenta());
        dto.setEnCuotas(hermano.getEnCuotas());
        dto.setObservaciones(hermano.getObservaciones());
        dto.setTutorLegal(hermano.getTutorLegal());
        dto.setDeleted(hermano.getDeleted());
        return dto;
    }
}
