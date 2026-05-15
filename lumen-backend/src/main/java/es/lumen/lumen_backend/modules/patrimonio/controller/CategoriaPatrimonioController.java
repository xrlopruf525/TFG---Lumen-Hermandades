package es.lumen.lumen_backend.modules.patrimonio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.lumen.lumen_backend.modules.patrimonio.dto.CategoriaPatrimonioDto;
import es.lumen.lumen_backend.modules.patrimonio.dto.CategoriaPatrimonioRequest;
import es.lumen.lumen_backend.modules.patrimonio.service.CategoriaPatrimonioService;

@RestController
@RequestMapping("categorias-patrimonio")
public class CategoriaPatrimonioController {

    @Autowired
    private CategoriaPatrimonioService categoriaPatrimonioService;

    @GetMapping
    public ResponseEntity<List<CategoriaPatrimonioDto>> obtenerTodasLasCategorias() {
        List<CategoriaPatrimonioDto> categorias = categoriaPatrimonioService.obtenerTodasLasCategorias();
        return new ResponseEntity<>(categorias, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaPatrimonioDto> obtenerCategoriaPorId(@PathVariable Integer id) {
        return new ResponseEntity<>(categoriaPatrimonioService.obtenerCategoriaPorId(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CategoriaPatrimonioDto> crearCategoria(@RequestBody CategoriaPatrimonioRequest categoria) {
        CategoriaPatrimonioDto nuevaCategoria = categoriaPatrimonioService.guardarCategoria(categoria);
        return new ResponseEntity<>(nuevaCategoria, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaPatrimonioDto> actualizarCategoria(@PathVariable Integer id, @RequestBody CategoriaPatrimonioRequest categoria) {
        CategoriaPatrimonioDto categoriaActualizada = categoriaPatrimonioService.actualizarCategoria(id, categoria);
        return new ResponseEntity<>(categoriaActualizada, HttpStatus.OK);
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
