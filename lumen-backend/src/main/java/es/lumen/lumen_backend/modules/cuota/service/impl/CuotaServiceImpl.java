package es.lumen.lumen_backend.modules.cuota.service.impl;


import es.lumen.lumen_backend.modules.cuota.entity.Cuota;
import es.lumen.lumen_backend.modules.cuota.repositories.CuotaRepository;
import es.lumen.lumen_backend.modules.cuota.service.CuotaService;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CuotaServiceImpl implements CuotaService {

    @Autowired
    private CuotaRepository cuotaRepository;

    @Autowired
    private HermanoRepository hermanoRepository;

    @Override
    public List<Cuota> obtenerTodasLasCuotas() {
        return cuotaRepository.findByDeletedFalse();
    }

    @Override
    public List<Cuota> obtenerCuotasPorHermano(Integer idHermano) {
        return cuotaRepository.findByHermanoIdAndDeletedFalse(idHermano);
    }

    @Override
    public Cuota pagarCuota(Integer idCuota, String urlRecibo) {
        Optional<Cuota> cuotaOptional = cuotaRepository.findById(idCuota);
        if (cuotaOptional.isPresent()) {
            Cuota cuota = cuotaOptional.get();
            cuota.setEstado("PAGADA");
            cuota.setFechaPago(LocalDate.now());
            cuota.setUrlRecibo(urlRecibo);
            return cuotaRepository.save(cuota);
        }
        return null;
    }

    @Override
    @Scheduled(cron = "0 0 0 1 1,4,7,10 *")
    public void generarCuotasTrimestrales() {
        List<Hermano> hermanosActivos = hermanoRepository.findByDeletedFalse().stream()
                .filter(h -> "ACTIVO".equalsIgnoreCase(h.getEstado()))
                .collect(Collectors.toList());

        int anyoActual = LocalDate.now().getYear();
        String concepto = "Cuota Trimestral " + LocalDate.now().getMonthValue() + "/" + anyoActual;
        BigDecimal importePorDefecto = new BigDecimal("15.00");

        for (Hermano hermano : hermanosActivos) {
            Cuota nuevaCuota = new Cuota();
            nuevaCuota.setHermano(hermano);
            nuevaCuota.setAnyo(anyoActual);
            nuevaCuota.setConcepto(concepto);
            nuevaCuota.setImporte(importePorDefecto);
            nuevaCuota.setEstado("PENDIENTE");
            nuevaCuota.setDeleted(false);
            cuotaRepository.save(nuevaCuota);
        }
    }
}