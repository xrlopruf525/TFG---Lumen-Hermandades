package es.lumen.lumen_backend.modules.gasto.controller;

import es.lumen.lumen_backend.modules.gasto.entity.Gasto;
import es.lumen.lumen_backend.modules.gasto.service.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("gastos")
@CrossOrigin(origins = "*")
public class GastoController {

    @Autowired
    private GastoService gastoService;

    @GetMapping("/{id}")
    public ResponseEntity<Gasto> obtenerGastoPorId(@PathVariable Integer id) {
        Gasto gasto = gastoService.obtenerGastoPorId(id);
        if (gasto != null) {
            return new ResponseEntity<>(gasto, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<Gasto>> obtenerTodosLosGastos() {
        List<Gasto> gastos = gastoService.obtenerTodosLosGastos();
        return new ResponseEntity<>(gastos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Gasto> crearGasto(@RequestBody Gasto gasto) {
        Gasto nuevoGasto = gastoService.guardarGasto(gasto);
        return new ResponseEntity<>(nuevoGasto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gasto> actualizarGasto(@PathVariable Integer id, @RequestBody Gasto gasto) {
        Gasto gastoActualizado = gastoService.actualizarGasto(id, gasto);
        if (gastoActualizado != null) {
            return new ResponseEntity<>(gastoActualizado, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarGasto(@PathVariable Integer id) {
        boolean eliminado = gastoService.eliminarGasto(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}