package es.lumen.lumen_backend.modules.patrimonio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import es.lumen.lumen_backend.modules.patrimonio.entity.Patrimonio;

@Repository
public interface PatrimonioRepository extends JpaRepository<Patrimonio, Integer> {
}
