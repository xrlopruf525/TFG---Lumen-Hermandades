package es.lumen.lumen_backend.modules.gasto.controller;

import es.lumen.lumen_backend.modules.gasto.dto.GastoDto;
import es.lumen.lumen_backend.modules.gasto.dto.GastoRequest;
import es.lumen.lumen_backend.modules.gasto.service.GastoService;
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
import java.util.List;

@RestController
@RequestMapping("gastos")
public class GastoController {

    @Autowired
    private GastoService gastoService;

    @GetMapping("/{id}")
    public ResponseEntity<GastoDto> obtenerGastoPorId(@PathVariable Integer id) {
        return new ResponseEntity<>(gastoService.obtenerGastoPorId(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<GastoDto>> obtenerTodosLosGastos() {
        List<GastoDto> gastos = gastoService.obtenerTodosLosGastos();
        return new ResponseEntity<>(gastos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<GastoDto> crearGasto(@RequestBody GastoRequest gasto) {
        GastoDto nuevoGasto = gastoService.guardarGasto(gasto);
        return new ResponseEntity<>(nuevoGasto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GastoDto> actualizarGasto(@PathVariable Integer id, @RequestBody GastoRequest gasto) {
        GastoDto gastoActualizado = gastoService.actualizarGasto(id, gasto);
        return new ResponseEntity<>(gastoActualizado, HttpStatus.OK);
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