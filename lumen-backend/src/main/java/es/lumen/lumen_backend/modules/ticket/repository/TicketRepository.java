package es.lumen.lumen_backend.modules.ticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import es.lumen.lumen_backend.modules.ticket.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    List<Ticket> findByDeletedFalseOrderByFechaEmisionDesc();

    List<Ticket> findTop3ByDeletedFalseOrderByFechaEmisionDesc();
}
