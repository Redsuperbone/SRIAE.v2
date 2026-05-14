package com.sriae.service;

import com.sriae.dto.EstadisticasIncidenciasResponse;
import com.sriae.dto.IncidenteResponse;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EstadisticaService {

    private final IncidenteService incidenteService;

    public EstadisticaService(IncidenteService incidenteService) {
        this.incidenteService = incidenteService;
    }

    public EstadisticasIncidenciasResponse obtenerEstadisticasIncidencias(String correoUsuario) {
        var incidentes = incidenteService.listar(correoUsuario, null, null, null, null);
        return new EstadisticasIncidenciasResponse(
                incidentes.size(),
                contarPorTipo(incidentes),
                contarPorAlumno(incidentes),
                contarPorMes(incidentes)
        );
    }

    private Map<String, Long> contarPorTipo(java.util.List<IncidenteResponse> incidentes) {
        return incidentes.stream()
                .collect(Collectors.groupingBy(
                        incidente -> valor(incidente.getNivelAlerta(), "SIN_CLASIFICAR"),
                        LinkedHashMap::new,
                        Collectors.counting()));
    }

    private Map<String, Long> contarPorAlumno(java.util.List<IncidenteResponse> incidentes) {
        return incidentes.stream()
                .collect(Collectors.groupingBy(
                        incidente -> valor(incidente.getNombreEstudiante(), "Sin estudiante"),
                        LinkedHashMap::new,
                        Collectors.counting()));
    }

    private Map<String, Long> contarPorMes(java.util.List<IncidenteResponse> incidentes) {
        return incidentes.stream()
                .filter(incidente -> incidente.getFechaIncidente() != null)
                .collect(Collectors.groupingBy(
                        incidente -> incidente.getFechaIncidente().getYear() + "-" + String.format("%02d", incidente.getFechaIncidente().getMonthValue()),
                        LinkedHashMap::new,
                        Collectors.counting()));
    }

    private String valor(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
