package com.sriae.dto;

import com.sriae.model.HistorialMedico;

import java.time.LocalDateTime;

public class HistorialMedicoResponse {

    private Integer idHistorial;
    private Integer matriculaEstudiante;
    private String nombreEstudiante;
    private String tipoSangre;
    private String alergias;
    private String enfermedadesCronicas;
    private String medicamentos;
    private String observaciones;
    private LocalDateTime fechaRegistro;
    private String registradoPor;

    public static HistorialMedicoResponse fromEntity(HistorialMedico historial) {
        HistorialMedicoResponse response = new HistorialMedicoResponse();
        response.idHistorial = historial.getIdHistorial();
        response.tipoSangre = historial.getTipoSangre();
        response.alergias = historial.getAlergias();
        response.enfermedadesCronicas = historial.getEnfermedadesCronicas();
        response.medicamentos = historial.getMedicamentos();
        response.observaciones = historial.getObservaciones();
        response.fechaRegistro = historial.getFechaRegistro();

        if (historial.getEstudiante() != null) {
            response.matriculaEstudiante = historial.getEstudiante().getMatricula();
            response.nombreEstudiante = historial.getEstudiante().getNombre() + " " + historial.getEstudiante().getApellidos();
        }

        if (historial.getUsuarioRegistra() != null) {
            response.registradoPor = historial.getUsuarioRegistra().getNombreCompleto();
        }

        return response;
    }

    public Integer getIdHistorial() { return idHistorial; }
    public Integer getMatriculaEstudiante() { return matriculaEstudiante; }
    public String getNombreEstudiante() { return nombreEstudiante; }
    public String getTipoSangre() { return tipoSangre; }
    public String getAlergias() { return alergias; }
    public String getEnfermedadesCronicas() { return enfermedadesCronicas; }
    public String getMedicamentos() { return medicamentos; }
    public String getObservaciones() { return observaciones; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public String getRegistradoPor() { return registradoPor; }
}
