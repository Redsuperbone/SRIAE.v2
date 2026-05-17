package com.sriae.controller;

import com.sriae.dto.HistorialMedicoRequest;
import com.sriae.dto.HistorialMedicoResponse;
import com.sriae.service.HistorialMedicoService;
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
@RequestMapping("/api/historial-medico")
@CrossOrigin("*")
public class HistorialMedicoController {

    private final HistorialMedicoService historialMedicoService;

    public HistorialMedicoController(HistorialMedicoService historialMedicoService) {
        this.historialMedicoService = historialMedicoService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENFERMERA','DOCENTE')")
    public List<HistorialMedicoResponse> listar(
            @RequestParam(required = false) Integer matricula,
            Authentication authentication) {
        return historialMedicoService.listar(matricula, authentication.getName());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENFERMERA','DOCENTE')")
    public HistorialMedicoResponse obtener(@PathVariable Integer id, Authentication authentication) {
        return historialMedicoService.obtener(id, authentication.getName());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENFERMERA')")
    public ResponseEntity<HistorialMedicoResponse> crear(
            @Valid @RequestBody HistorialMedicoRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(historialMedicoService.crear(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENFERMERA')")
    public HistorialMedicoResponse actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody HistorialMedicoRequest request,
            Authentication authentication) {
        return historialMedicoService.actualizar(id, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id, Authentication authentication) {
        historialMedicoService.eliminar(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
