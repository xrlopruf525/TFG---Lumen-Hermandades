package es.lumen.lumen_backend.modules.evento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import es.lumen.lumen_backend.modules.evento.entity.Evento;

public interface EventoRepository extends JpaRepository<Evento, Integer> {

    List<Evento> findByDeletedFalseOrderByFechaInicioAsc();
}
