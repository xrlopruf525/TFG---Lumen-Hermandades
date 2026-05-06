package es.lumen.lumen_backend.modules.patrimonio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.lumen.lumen_backend.modules.patrimonio.entity.Patrimonio;
import es.lumen.lumen_backend.modules.patrimonio.service.PatrimonioService;

@RestController
@RequestMapping("patrimonio")
@CrossOrigin(origins = "*")
public class PatrimonioController {

    @Autowired
    private PatrimonioService patrimonioService;

    @GetMapping
    public ResponseEntity<List<Patrimonio>> obtenerTodosLosPatrimonios() {
        List<Patrimonio> patrimonios = patrimonioService.obtenerTodosLosPatrimonios();
        return new ResponseEntity<>(patrimonios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patrimonio> obtenerPatrimonioPorId(@PathVariable Integer id) {
        Patrimonio patrimonio = patrimonioService.obtenerPatrimonioPorId(id);
        if (patrimonio != null) {
            return new ResponseEntity<>(patrimonio, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<Patrimonio> crearPatrimonio(@RequestBody Patrimonio patrimonio) {
        Patrimonio nuevoPatrimonio = patrimonioService.guardarPatrimonio(patrimonio);
        return new ResponseEntity<>(nuevoPatrimonio, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patrimonio> actualizarPatrimonio(@PathVariable Integer id, @RequestBody Patrimonio patrimonio) {
        Patrimonio patrimonioActualizado = patrimonioService.actualizarPatrimonio(id, patrimonio);
        if (patrimonioActualizado != null) {
            return new ResponseEntity<>(patrimonioActualizado, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
