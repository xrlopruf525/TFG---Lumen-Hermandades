package es.lumen.lumen_backend.modules.relaciones.repository;

import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupo;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HermanoGrupoRepository extends JpaRepository<HermanoGrupo, HermanoGrupoId> {

    List<HermanoGrupo> findByIdIdGrupo(Integer idGrupo);

    List<HermanoGrupo> findByIdIdGrupoAndDeletedFalse(Integer idGrupo);

    Optional<HermanoGrupo> findByIdIdHermanoAndIdIdGrupo(Integer idHermano, Integer idGrupo);

    long countByIdIdGrupoAndDeletedFalse(Integer idGrupo);

    List<HermanoGrupo> findByIdIdHermanoAndDeletedFalse(Integer idHermano);
}