package com.sriae.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class IncidenteRequest {

    @NotBlank(message = "El titulo es obligatorio")
    private String titulo;

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    private String ubicacion;

    @NotBlank(message = "El tipo de incidente es obligatorio")
    private String tipo;

    @NotBlank(message = "El nivel de alerta es obligatorio")
    private String nivelAlerta;

    @NotNull(message = "La matricula del estudiante es obligatoria")
    private Integer matriculaEstudiante;

    private LocalDateTime fechaIncidente;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getNivelAlerta() { return nivelAlerta; }
    public void setNivelAlerta(String nivelAlerta) { this.nivelAlerta = nivelAlerta; }
    public Integer getMatriculaEstudiante() { return matriculaEstudiante; }
    public void setMatriculaEstudiante(Integer matriculaEstudiante) { this.matriculaEstudiante = matriculaEstudiante; }
    public LocalDateTime getFechaIncidente() { return fechaIncidente; }
    public void setFechaIncidente(LocalDateTime fechaIncidente) { this.fechaIncidente = fechaIncidente; }
}
