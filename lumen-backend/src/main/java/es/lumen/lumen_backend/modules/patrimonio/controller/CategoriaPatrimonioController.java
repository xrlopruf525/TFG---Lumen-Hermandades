package es.lumen.lumen_backend.modules.patrimonio.controller;

import es.lumen.lumen_backend.modules.patrimonio.entity.CategoriaPatrimonio;
import es.lumen.lumen_backend.modules.patrimonio.service.CategoriaPatrimonioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("categorias-patrimonio")
@CrossOrigin(origins = "*")
public class CategoriaPatrimonioController {

    @Autowired
    private CategoriaPatrimonioService categoriaPatrimonioService;

    @GetMapping
    public ResponseEntity<List<CategoriaPatrimonio>> obtenerTodasLasCategorias() {
        List<CategoriaPatrimonio> categorias = categoriaPatrimonioService.obtenerTodasLasCategorias();
        return new ResponseEntity<>(categorias, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaPatrimonio> obtenerCategoriaPorId(@PathVariable Integer id) {
        CategoriaPatrimonio categoria = categoriaPatrimonioService.obtenerCategoriaPorId(id);
        if (categoria != null) {
            return new ResponseEntity<>(categoria, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<CategoriaPatrimonio> crearCategoria(@RequestBody CategoriaPatrimonio categoria) {
        CategoriaPatrimonio nuevaCategoria = categoriaPatrimonioService.guardarCategoria(categoria);
        return new ResponseEntity<>(nuevaCategoria, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaPatrimonio> actualizarCategoria(@PathVariable Integer id, @RequestBody CategoriaPatrimonio categoria) {
        CategoriaPatrimonio categoriaActualizada = categoriaPatrimonioService.actualizarCategoria(id, categoria);
        if (categoriaActualizada != null) {
            return new ResponseEntity<>(categoriaActualizada, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Integer id) {
        boolean eliminada = categoriaPatrimonioService.eliminarCategoria(id);
        if (eliminada) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
