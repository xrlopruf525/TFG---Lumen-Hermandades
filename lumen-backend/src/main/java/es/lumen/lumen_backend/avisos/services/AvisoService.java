package es.lumen.lumen_backend.avisos.services;

import es.lumen.lumen_backend.avisos.dto.AvisoRequest;

public interface AvisoService {

    int enviarAviso(AvisoRequest request);
}