package com.sriae.controller;

import com.sriae.dto.EstadisticasIncidenciasResponse;
import com.sriae.service.EstadisticaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin("*")
public class EstadisticaController {

    private final EstadisticaService estadisticaService;

    public EstadisticaController(EstadisticaService estadisticaService) {
        this.estadisticaService = estadisticaService;
    }

    @GetMapping("/incidencias")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','DOCENTE')")
    public EstadisticasIncidenciasResponse incidencias(Authentication authentication) {
        return estadisticaService.obtenerEstadisticasIncidencias(authentication.getName());
    }
}
