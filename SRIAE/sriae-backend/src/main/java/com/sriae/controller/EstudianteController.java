package com.sriae.controller;

import com.sriae.dto.EstudianteRequest;
import com.sriae.dto.EstudianteResponse;
import com.sriae.dto.UsuarioResponse;
import com.sriae.service.EstudianteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin("*")
public class EstudianteController {

    private final EstudianteService estudianteService;

    public EstudianteController(EstudianteService estudianteService) {
        this.estudianteService = estudianteService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','DOCENTE','MEDICO','TUTOR')")
    public List<EstudianteResponse> buscar(
            Authentication authentication,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Integer matricula,
            @RequestParam(required = false) String grupo) {
        return estudianteService.buscar(authentication.getName(), nombre, matricula, grupo);
    }

    @GetMapping("/{matricula}")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','DOCENTE','MEDICO','TUTOR')")
    public EstudianteResponse obtener(Authentication authentication, @PathVariable Integer matricula) {
        return estudianteService.obtener(authentication.getName(), matricula);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstudianteResponse> crear(
            @Valid @RequestBody EstudianteRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(estudianteService.crear(request, authentication.getName()));
    }

    @PutMapping("/{matricula}")
    @PreAuthorize("hasRole('ADMIN')")
    public EstudianteResponse actualizar(
            @PathVariable Integer matricula,
            @Valid @RequestBody EstudianteRequest request,
            Authentication authentication) {
        return estudianteService.actualizar(matricula, request, authentication.getName());
    }

    @DeleteMapping("/{matricula}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer matricula, Authentication authentication) {
        estudianteService.eliminar(matricula, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{matricula}/tutores/{idTutor}")
    @PreAuthorize("hasRole('ADMIN')")
    public EstudianteResponse vincularTutor(
            @PathVariable Integer matricula,
            @PathVariable Integer idTutor,
            Authentication authentication) {
        return estudianteService.vincularTutor(matricula, idTutor, authentication.getName());
    }

    @DeleteMapping("/{matricula}/tutores/{idTutor}")
    @PreAuthorize("hasRole('ADMIN')")
    public EstudianteResponse desvincularTutor(
            @PathVariable Integer matricula,
            @PathVariable Integer idTutor,
            Authentication authentication) {
        return estudianteService.desvincularTutor(matricula, idTutor, authentication.getName());
    }

    @GetMapping("/{matricula}/tutores")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','DOCENTE','MEDICO')")
    public List<UsuarioResponse> listarTutores(@PathVariable Integer matricula) {
        return estudianteService.listarTutores(matricula);
    }

    @PostMapping("/{matricula}/docentes/{idDocente}")
    @PreAuthorize("hasRole('ADMIN')")
    public EstudianteResponse vincularDocente(
            @PathVariable Integer matricula,
            @PathVariable Integer idDocente,
            Authentication authentication) {
        return estudianteService.vincularDocente(matricula, idDocente, authentication.getName());
    }

    @DeleteMapping("/{matricula}/docentes/{idDocente}")
    @PreAuthorize("hasRole('ADMIN')")
    public EstudianteResponse desvincularDocente(
            @PathVariable Integer matricula,
            @PathVariable Integer idDocente,
            Authentication authentication) {
        return estudianteService.desvincularDocente(matricula, idDocente, authentication.getName());
    }

    @GetMapping("/{matricula}/docentes")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','MEDICO')")
    public List<UsuarioResponse> listarDocentes(@PathVariable Integer matricula) {
        return estudianteService.listarDocentes(matricula);
    }
}
