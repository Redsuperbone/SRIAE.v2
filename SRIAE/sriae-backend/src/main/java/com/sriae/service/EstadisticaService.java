package com.sriae.service;

import com.sriae.dto.EstadisticasIncidenciasResponse;
import com.sriae.dto.EstadisticasInicioResponse;
import com.sriae.dto.IncidenteResponse;
import com.sriae.model.Incidente;
import com.sriae.repository.IncidenteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EstadisticaService {

    private final IncidenteService incidenteService;
    private final IncidenteRepository incidenteRepository;
    private static final ZoneId ZONA_SISTEMA = ZoneId.of("America/Mexico_City");
    private static final Set<String> ESTADOS_RESUELTOS = Set.of(
            "CERRADA", "CERRADO", "RESUELTA", "RESUELTO", "FINALIZADA", "FINALIZADO");

    public EstadisticaService(IncidenteService incidenteService, IncidenteRepository incidenteRepository) {
        this.incidenteService = incidenteService;
        this.incidenteRepository = incidenteRepository;
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

    public EstadisticasInicioResponse obtenerEstadisticasInicioGlobales() {
        LocalDate hoy = LocalDate.now(ZONA_SISTEMA);
        LocalDate ayer = hoy.minusDays(1);
        List<Incidente> incidentes = incidenteRepository.findAll();

        long incidentesHoy = incidentes.stream()
                .filter(incidente -> esMismoDia(incidente, hoy))
                .count();
        long incidentesAyer = incidentes.stream()
                .filter(incidente -> esMismoDia(incidente, ayer))
                .count();
        long resueltos = incidentes.stream()
                .filter(this::estaResuelto)
                .count();

        return new EstadisticasInicioResponse(
                incidentesHoy,
                incidentesAyer,
                incidentes.size() - resueltos,
                resueltos
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

    private boolean esMismoDia(Incidente incidente, LocalDate fecha) {
        return incidente.getFechaIncidente() != null
                && incidente.getFechaIncidente().toLocalDate().isEqual(fecha);
    }

    private boolean estaResuelto(Incidente incidente) {
        return ESTADOS_RESUELTOS.contains(valor(incidente.getEstado(), "").trim().toUpperCase());
    }
}
