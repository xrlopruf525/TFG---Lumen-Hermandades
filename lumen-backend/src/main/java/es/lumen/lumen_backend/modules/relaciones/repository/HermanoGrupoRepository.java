package es.lumen.lumen_backend.modules.relaciones.repository;

import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupo;
import es.lumen.lumen_backend.modules.relaciones.entity.HermanoGrupoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HermanoGrupoRepository extends JpaRepository<HermanoGrupo, HermanoGrupoId> {
    
    @Query("SELECT hg FROM HermanoGrupo hg WHERE hg.id.idGrupo = :idGrupo AND hg.deleted = false")
    List<HermanoGrupo> findByIdIdGrupoAndDeletedFalse(@Param("idGrupo") Integer idGrupo);
    
    @Query("SELECT hg FROM HermanoGrupo hg WHERE hg.id.idHermano = :idHermano AND hg.deleted = false")
    List<HermanoGrupo> findByIdIdHermanoAndDeletedFalse(@Param("idHermano") Integer idHermano);
}
