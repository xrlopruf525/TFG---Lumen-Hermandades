package es.lumen.lumen_backend.modules.evento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import es.lumen.lumen_backend.modules.evento.entity.AsistenciaEvento;
import es.lumen.lumen_backend.modules.evento.entity.AsistenciaEventoId;

public interface AsistenciaEventoRepository extends JpaRepository<AsistenciaEvento, AsistenciaEventoId> {

    List<AsistenciaEvento> findByEvento_IdEventoAndDeletedFalse(Integer idEvento);

    List<AsistenciaEvento> findByEvento_IdEvento(Integer idEvento);

    List<AsistenciaEvento> findByHermano_IdAndDeletedFalse(Integer idHermano);
}
