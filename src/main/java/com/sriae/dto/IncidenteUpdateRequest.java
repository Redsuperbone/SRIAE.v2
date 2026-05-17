package com.sriae.dto;

public class IncidenteUpdateRequest {

    private String titulo;
    private String descripcion;
    private String ubicacion;
    private String tipo;
    private String nivelAlerta;
    private String estado;
    private Integer matriculaEstudiante;

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
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Integer getMatriculaEstudiante() { return matriculaEstudiante; }
    public void setMatriculaEstudiante(Integer matriculaEstudiante) { this.matriculaEstudiante = matriculaEstudiante; }
}
