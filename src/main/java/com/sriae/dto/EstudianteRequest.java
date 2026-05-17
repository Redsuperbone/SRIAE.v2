package com.sriae.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class EstudianteRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @NotNull(message = "El grado es obligatorio")
    private Integer grado;

    @NotBlank(message = "El grupo es obligatorio")
    private String grupo;

    private String alergias;
    private String condicionesCronicas;
    private LocalDate fechaNacimiento;
    private String medicamentosActuales;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public Integer getGrado() { return grado; }
    public void setGrado(Integer grado) { this.grado = grado; }
    public String getGrupo() { return grupo; }
    public void setGrupo(String grupo) { this.grupo = grupo; }
    public String getAlergias() { return alergias; }
    public void setAlergias(String alergias) { this.alergias = alergias; }
    public String getCondicionesCronicas() { return condicionesCronicas; }
    public void setCondicionesCronicas(String condicionesCronicas) { this.condicionesCronicas = condicionesCronicas; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public String getMedicamentosActuales() { return medicamentosActuales; }
    public void setMedicamentosActuales(String medicamentosActuales) { this.medicamentosActuales = medicamentosActuales; }
}
