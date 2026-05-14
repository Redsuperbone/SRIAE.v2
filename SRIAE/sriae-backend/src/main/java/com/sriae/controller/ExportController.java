package com.sriae.controller;

import com.sriae.service.ExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
@CrossOrigin("*")
public class ExportController {

    private static final String UTF8_BOM = "\uFEFF";

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/incidencias/csv")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','DOCENTE','MEDICO')")
    public ResponseEntity<String> exportarIncidenciasCsv(Authentication authentication) {
        return csv("incidencias.csv", exportService.exportarIncidenciasCsv(authentication.getName()));
    }

    @GetMapping("/historial-medico/csv")
    @PreAuthorize("hasAnyRole('ADMIN','MEDICO')")
    public ResponseEntity<String> exportarHistorialMedicoCsv() {
        return csv("historial-medico.csv", exportService.exportarHistorialMedicoCsv());
    }

    private ResponseEntity<String> csv(String filename, String contenido) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(UTF8_BOM + contenido);
    }
}
