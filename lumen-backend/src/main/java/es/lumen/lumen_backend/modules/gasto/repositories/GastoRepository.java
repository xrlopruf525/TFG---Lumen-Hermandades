package es.lumen.lumen_backend.modules.gasto.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.lumen.lumen_backend.modules.gasto.entity.Gasto;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Integer> {

    List<Gasto> findByDeletedFalse();
}
