package com.sriae.controller;

import com.sriae.dto.IncidenteRequest;
import com.sriae.dto.IncidenteResponse;
import com.sriae.dto.IncidenteUpdateRequest;
import com.sriae.service.IncidenteService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incidentes")
@CrossOrigin("*")
public class IncidenteController {

    private final IncidenteService incidenteService;

    public IncidenteController(IncidenteService incidenteService) {
        this.incidenteService = incidenteService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','DOCENTE','ENFERMERA','TUTOR')")
    public List<IncidenteResponse> listar(
            Authentication authentication,
            @RequestParam(required = false) Integer matricula,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return incidenteService.listar(authentication.getName(), matricula, tipo, desde, hasta);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','DOCENTE','ENFERMERA')")
    public ResponseEntity<IncidenteResponse> guardar(
            Authentication authentication,
            @Valid @RequestBody IncidenteRequest request) throws IOException {
        IncidenteResponse response = incidenteService.crear(request, authentication.getName(), null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','DOCENTE','ENFERMERA')")
    public ResponseEntity<IncidenteResponse> guardarConFoto(
            Authentication authentication,
            @Valid @ModelAttribute IncidenteRequest request,
            @RequestParam(value = "foto", required = false) MultipartFile foto) throws IOException {
        IncidenteResponse response = incidenteService.crear(request, authentication.getName(), foto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCENTE','ENFERMERA')")
    public IncidenteResponse actualizar(
            @PathVariable Integer id,
            @RequestBody IncidenteUpdateRequest request,
            Authentication authentication) {
        return incidenteService.actualizar(id, request, authentication.getName());
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN','DOCENTE','ENFERMERA')")
    public IncidenteResponse actualizarEstado(
            @PathVariable Integer id,
            @RequestParam("nuevoEstado") String nuevoEstado,
            Authentication authentication) {
        return incidenteService.actualizarEstado(id, nuevoEstado, authentication.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id, Authentication authentication) {
        incidenteService.eliminar(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
