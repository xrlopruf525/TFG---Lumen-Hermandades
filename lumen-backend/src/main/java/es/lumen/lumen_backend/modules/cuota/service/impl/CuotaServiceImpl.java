package es.lumen.lumen_backend.modules.cuota.service.impl;


import es.lumen.lumen_backend.modules.cuota.entity.Cuota;
import es.lumen.lumen_backend.modules.cuota.repositories.CuotaRepository;
import es.lumen.lumen_backend.modules.cuota.service.CuotaService;
import es.lumen.lumen_backend.modules.hermano.entity.Hermano;
import es.lumen.lumen_backend.modules.hermano.repository.HermanoRepository;
import es.lumen.lumen_backend.modules.cuota.dto.CuotaDto;
import es.lumen.lumen_backend.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CuotaServiceImpl implements CuotaService {

    @Autowired
    private CuotaRepository cuotaRepository;

    @Autowired
    private HermanoRepository hermanoRepository;

    @Override
    public List<CuotaDto> obtenerTodasLasCuotas() {
        return cuotaRepository.findByDeletedFalse().stream().map(this::toDto).toList();
    }

    @Override
    public List<CuotaDto> obtenerCuotasPorHermano(Integer idHermano) {
        return cuotaRepository.findByHermanoIdAndDeletedFalse(idHermano).stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public CuotaDto pagarCuota(Integer idCuota, String urlRecibo) {
        Optional<Cuota> cuotaOptional = cuotaRepository.findById(idCuota);
        Cuota cuota = cuotaOptional.filter(valor -> Boolean.FALSE.equals(valor.getDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Cuota no encontrada con id: " + idCuota));
        cuota.setEstado("PAGADA");
        cuota.setFechaPago(LocalDate.now());
        cuota.setUrlRecibo(urlRecibo);
        return toDto(cuotaRepository.save(cuota));
    }

    @Override
    @Scheduled(cron = "0 0 0 1 1,4,7,10 *")
    @Transactional
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

    private CuotaDto toDto(Cuota cuota) {
        CuotaDto dto = new CuotaDto();
        dto.setIdCuota(cuota.getIdCuota());
        dto.setIdHermano(cuota.getHermano() != null ? cuota.getHermano().getId() : null);
        dto.setAnyo(cuota.getAnyo());
        dto.setConcepto(cuota.getConcepto());
        dto.setImporte(cuota.getImporte());
        dto.setEstado(cuota.getEstado());
        dto.setFechaPago(cuota.getFechaPago());
        dto.setUrlRecibo(cuota.getUrlRecibo());
        dto.setDeleted(cuota.getDeleted());
        return dto;
    }
}