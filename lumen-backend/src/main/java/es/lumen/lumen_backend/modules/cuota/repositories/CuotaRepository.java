package es.lumen.lumen_backend.modules.cuota.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import es.lumen.lumen_backend.modules.cuota.entity.Cuota;

@Repository
public interface CuotaRepository extends JpaRepository<Cuota, Integer> {
    List<Cuota> findByDeletedFalse();
    List<Cuota> findByHermanoIdAndDeletedFalse(Integer idHermano);
}
