package es.lumen.lumen_backend.modules.patrimonio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.lumen.lumen_backend.modules.patrimonio.dto.PatrimonioDto;
import es.lumen.lumen_backend.modules.patrimonio.dto.PatrimonioRequest;
import es.lumen.lumen_backend.modules.patrimonio.service.PatrimonioService;

@RestController
@RequestMapping("patrimonio")
public class PatrimonioController {

    @Autowired
    private PatrimonioService patrimonioService;

    @GetMapping
    public ResponseEntity<List<PatrimonioDto>> obtenerTodosLosPatrimonios() {
        List<PatrimonioDto> patrimonios = patrimonioService.obtenerTodosLosPatrimonios();
        return new ResponseEntity<>(patrimonios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatrimonioDto> obtenerPatrimonioPorId(@PathVariable Integer id) {
        return new ResponseEntity<>(patrimonioService.obtenerPatrimonioPorId(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PatrimonioDto> crearPatrimonio(@RequestBody PatrimonioRequest patrimonio) {
        PatrimonioDto nuevoPatrimonio = patrimonioService.guardarPatrimonio(patrimonio);
        return new ResponseEntity<>(nuevoPatrimonio, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatrimonioDto> actualizarPatrimonio(@PathVariable Integer id, @RequestBody PatrimonioRequest patrimonio) {
        PatrimonioDto patrimonioActualizado = patrimonioService.actualizarPatrimonio(id, patrimonio);
        return new ResponseEntity<>(patrimonioActualizado, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPatrimonio(@PathVariable Integer id) {
        boolean eliminado = patrimonioService.eliminarPatrimonio(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
