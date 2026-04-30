package es.lumen.lumen_backend.modules.hermano.controller;

import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import es.lumen.lumen_backend.modules.hermano.dto.PortalHermanoDto;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.usuario.entity.Usuario;
import es.lumen.lumen_backend.modules.usuario.repository.UsuarioRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hermano")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@PreAuthorize("hasRole('HERMANO')")
public class PortalHermanoController {

    private final UsuarioRepository usuarioRepository;
    private final HermanoRepository hermanoRepository;

    public PortalHermanoController(UsuarioRepository usuarioRepository, HermanoRepository hermanoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.hermanoRepository = hermanoRepository;
    }

    @GetMapping("/me")
    public PortalHermanoDto getMiPerfil(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Hermano hermano = hermanoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Hermano no encontrado"));

        return new PortalHermanoDto(
                hermano.getId(),
                (hermano.getNombre() + " " + valor(hermano.getPrimerApellido()) + " " + valor(hermano.getSegundoApellido())).trim().replaceAll(" +", " "),
                hermano.getNumeroHermano(),
                hermano.getEmail(),
                hermano.getTelefonoMovil(),
                construirDireccion(hermano),
                hermano.getNif(),
                hermano.getFechaAlta(),
                hermano.getEstado()
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