package com.sriae.dto;

import com.sriae.model.Estudiante;
import com.sriae.model.Incidente;

import java.time.LocalDateTime;
import java.util.List;

public class IncidenteResponse {

    private Integer idIncidente;
    private String titulo;
    private String descripcion;
    private String ubicacion;
    private String tipo;
    private String nivelAlerta;
    private String estado;
    private LocalDateTime fechaIncidente;
    private String reportadoPor;
    private Integer matriculaEstudiante;
    private String nombreEstudiante;
    private String fotoRuta;
    private List<UsuarioResponse> tutores = List.of();

    public static IncidenteResponse fromEntity(Incidente incidente) {
        IncidenteResponse response = new IncidenteResponse();
        response.idIncidente = incidente.getIdIncidente();
        response.titulo = incidente.getTitulo();
        response.descripcion = incidente.getDescripcion();
        response.ubicacion = incidente.getUbicacion();
        response.tipo = incidente.getTipo();
        response.nivelAlerta = incidente.getNivelAlerta();
        response.estado = incidente.getEstado();
        response.fechaIncidente = incidente.getFechaIncidente();
        response.fotoRuta = incidente.getFotoRuta();

        if (incidente.getUsuarioReporta() != null) {
            response.reportadoPor = incidente.getUsuarioReporta().getNombreCompleto();
        }

        Estudiante estudiante = incidente.getEstudiante();
        if (estudiante != null) {
            response.matriculaEstudiante = estudiante.getMatricula();
            response.nombreEstudiante = estudiante.getNombre() + " " + estudiante.getApellidos();
            if (estudiante.getTutores() != null) {
                response.tutores = estudiante.getTutores().stream()
                    .map(UsuarioResponse::fromEntity)
                    .toList();
            }
        }

        return response;
    }

    public Integer getIdIncidente() { return idIncidente; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public String getUbicacion() { return ubicacion; }
    public String getTipo() { return tipo; }
    public String getNivelAlerta() { return nivelAlerta; }
    public String getEstado() { return estado; }
    public LocalDateTime getFechaIncidente() { return fechaIncidente; }
    public String getReportadoPor() { return reportadoPor; }
    public Integer getMatriculaEstudiante() { return matriculaEstudiante; }
    public String getNombreEstudiante() { return nombreEstudiante; }
    public String getFotoRuta() { return fotoRuta; }
    public List<UsuarioResponse> getTutores() { return tutores; }
}
