package es.lumen.lumen_backend.modules.hermano.controller;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.cuota.dto.CuotaResumenDto;
import es.lumen.lumen_backend.modules.cuota.entity.Cuota;
import es.lumen.lumen_backend.modules.cuota.repositories.CuotaRepository;
import es.lumen.lumen_backend.modules.grupo.dto.GrupoResumenDto;
import es.lumen.lumen_backend.modules.grupo.entity.Grupo;
import es.lumen.lumen_backend.modules.grupo.repository.GrupoRepository;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupo;
import es.lumen.lumen_backend.modules.relaciones.repository.HermanoGrupoRepository;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hermano")
@PreAuthorize("hasRole('HERMANO')")
public class PortalHermanoController {

    private final UsuarioRepository usuarioRepository;
    private final HermanoRepository hermanoRepository;
    private final HermanoGrupoRepository hermanoGrupoRepository;
    private final GrupoRepository grupoRepository;
    private final CuotaRepository cuotaRepository;

    public PortalHermanoController(UsuarioRepository usuarioRepository, HermanoRepository hermanoRepository,
                                  HermanoGrupoRepository hermanoGrupoRepository, GrupoRepository grupoRepository,
                                  CuotaRepository cuotaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.hermanoRepository = hermanoRepository;
        this.hermanoGrupoRepository = hermanoGrupoRepository;
        this.grupoRepository = grupoRepository;
        this.cuotaRepository = cuotaRepository;
    }

    @GetMapping("/me")
    public PortalHermanoDto getMiPerfil(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Hermano hermano = hermanoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Hermano no encontrado"));

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

        // Obtener las cuotas del hermano
        List<Cuota> cuotasHermano = cuotaRepository.findByHermanoIdAndDeletedFalse(hermano.getId());
        List<CuotaResumenDto> cuotas = cuotasHermano.stream()
                .map(c -> new CuotaResumenDto(
                        c.getIdCuota(),
                        c.getAnyo(),
                        c.getConcepto(),
                        c.getImporte(),
                        c.getEstado(),
                        c.getFechaPago()
                ))
                .collect(Collectors.toList());

        return new PortalHermanoDto(
                hermano.getId(),
                (hermano.getNombre() + " " + valor(hermano.getPrimerApellido()) + " " + valor(hermano.getSegundoApellido())).trim().replaceAll(" +", " "),
                hermano.getNumeroHermano(),
                hermano.getEmail(),
                hermano.getTelefonoMovil(),
                construirDireccion(hermano),
                hermano.getNif(),
                hermano.getFechaAlta(),
                hermano.getEstado(),
                grupos,
                cuotas
        );
    }

    private String construirDireccion(Hermano hermano) {
        String direccion = String.join(" ",
                valor(hermano.getDireccion()),
                valor(hermano.getNumero()),
                valor(hermano.getPisoPuerta()),
                valor(hermano.getCodigoPostal()),
                valor(hermano.getPoblacion()),
                valor(hermano.getProvincia()),
                valor(hermano.getPais()));

        return direccion.trim().replaceAll(" +", " ");
    }

    private String valor(String value) {
        return value == null ? "" : value;
    }
}