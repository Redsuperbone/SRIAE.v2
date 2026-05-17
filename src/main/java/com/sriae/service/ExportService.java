package com.sriae.service;

import com.sriae.dto.IncidenteResponse;
import com.sriae.model.HistorialMedico;
import com.sriae.repository.HistorialMedicoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ExportService {

    private final IncidenteService incidenteService;
    private final HistorialMedicoRepository historialMedicoRepository;

    public ExportService(IncidenteService incidenteService, HistorialMedicoRepository historialMedicoRepository) {
        this.incidenteService = incidenteService;
        this.historialMedicoRepository = historialMedicoRepository;
    }

    public String exportarIncidenciasCsv(String correoUsuario) {
        StringBuilder csv = new StringBuilder();
        csv.append("id,titulo,tipo,nivelAlerta,estado,fecha,matriculaEstudiante,nombreEstudiante,reportadoPor\n");

        for (IncidenteResponse incidente : incidenteService.listar(correoUsuario, null, null, null, null)) {
            csv.append(valor(incidente.getIdIncidente())).append(",");
            csv.append(valor(incidente.getTitulo())).append(",");
            csv.append(valor(incidente.getTipo())).append(",");
            csv.append(valor(incidente.getNivelAlerta())).append(",");
            csv.append(valor(incidente.getEstado())).append(",");
            csv.append(valor(incidente.getFechaIncidente())).append(",");
            csv.append(valor(incidente.getMatriculaEstudiante())).append(",");
            csv.append(valor(incidente.getNombreEstudiante())).append(",");
            csv.append(valor(incidente.getReportadoPor())).append("\n");
        }

        return csv.toString();
    }

    public String exportarHistorialMedicoCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("id,matriculaEstudiante,nombreEstudiante,tipoSangre,alergias,enfermedadesCronicas,medicamentos,observaciones,fecha,registradoPor\n");

        for (HistorialMedico historial : historialMedicoRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaRegistro"))) {
            csv.append(valor(historial.getIdHistorial())).append(",");
            csv.append(valor(historial.getEstudiante() == null ? null : historial.getEstudiante().getMatricula())).append(",");
            csv.append(valor(historial.getEstudiante() == null ? null : historial.getEstudiante().getNombre() + " " + historial.getEstudiante().getApellidos())).append(",");
            csv.append(valor(historial.getTipoSangre())).append(",");
            csv.append(valor(historial.getAlergias())).append(",");
            csv.append(valor(historial.getEnfermedadesCronicas())).append(",");
            csv.append(valor(historial.getMedicamentos())).append(",");
            csv.append(valor(historial.getObservaciones())).append(",");
            csv.append(valor(historial.getFechaRegistro())).append(",");
            csv.append(valor(historial.getUsuarioRegistra() == null ? null : historial.getUsuarioRegistra().getNombreCompleto())).append("\n");
        }

        return csv.toString();
    }

    private String valor(Object valor) {
        if (valor == null) {
            return "";
        }

        String texto = valor.toString().replace("\"", "\"\"");
        return "\"" + texto + "\"";
    }
}
