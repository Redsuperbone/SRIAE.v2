package com.sriae.dto;

import jakarta.validation.constraints.NotNull;

public class HistorialMedicoRequest {

    @NotNull(message = "La matricula del estudiante es obligatoria")
    private Integer matriculaEstudiante;

    private String tipoSangre;
    private String alergias;
    private String enfermedadesCronicas;
    private String medicamentos;
    private String observaciones;

    public Integer getMatriculaEstudiante() { return matriculaEstudiante; }
    public void setMatriculaEstudiante(Integer matriculaEstudiante) { this.matriculaEstudiante = matriculaEstudiante; }
    public String getTipoSangre() { return tipoSangre; }
    public void setTipoSangre(String tipoSangre) { this.tipoSangre = tipoSangre; }
    public String getAlergias() { return alergias; }
    public void setAlergias(String alergias) { this.alergias = alergias; }
    public String getEnfermedadesCronicas() { return enfermedadesCronicas; }
    public void setEnfermedadesCronicas(String enfermedadesCronicas) { this.enfermedadesCronicas = enfermedadesCronicas; }
    public String getMedicamentos() { return medicamentos; }
    public void setMedicamentos(String medicamentos) { this.medicamentos = medicamentos; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
