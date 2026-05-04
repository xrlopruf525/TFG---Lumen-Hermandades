package es.lumen.lumen_backend.modules.cuota.controller;


import es.lumen.lumen_backend.modules.cuota.entity.Cuota;
import es.lumen.lumen_backend.modules.cuota.service.CuotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cuotas")
@CrossOrigin(origins = "*")
public class CuotaController {

    @Autowired
    private CuotaService cuotaService;

    @GetMapping
    public ResponseEntity<List<Cuota>> obtenerTodasLasCuotas() {
        List<Cuota> cuotas = cuotaService.obtenerTodasLasCuotas();
        return new ResponseEntity<>(cuotas, HttpStatus.OK);
    }

    @GetMapping("/hermano/{idHermano}")
    public ResponseEntity<List<Cuota>> obtenerCuotasPorHermano(@PathVariable Integer idHermano) {
        List<Cuota> cuotas = cuotaService.obtenerCuotasPorHermano(idHermano);
        return new ResponseEntity<>(cuotas, HttpStatus.OK);
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<Cuota> pagarCuota(@PathVariable Integer id, @RequestParam(required = false) String urlRecibo) {
        Cuota cuotaPagada = cuotaService.pagarCuota(id, urlRecibo);
        if (cuotaPagada != null) {
            return new ResponseEntity<>(cuotaPagada, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/generar-manual")
    public ResponseEntity<Void> generarCuotasManualmente() {
        cuotaService.generarCuotasTrimestrales();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}