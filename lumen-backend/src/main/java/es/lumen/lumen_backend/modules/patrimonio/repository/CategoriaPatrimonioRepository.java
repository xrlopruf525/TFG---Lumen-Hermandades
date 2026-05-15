package es.lumen.lumen_backend.modules.patrimonio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.lumen.lumen_backend.modules.patrimonio.entity.CategoriaPatrimonio;

@Repository
public interface CategoriaPatrimonioRepository extends JpaRepository<CategoriaPatrimonio, Integer> {

    List<CategoriaPatrimonio> findByDeletedFalse();
}
