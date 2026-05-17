package com.sriae.dto;

import com.sriae.model.Estudiante;

import java.time.LocalDate;
import java.util.List;

public class EstudianteResponse {

    private Integer matricula;
    private String nombre;
    private String apellidos;
    private Integer grado;
    private String grupo;
    private String alergias;
    private String condicionesCronicas;
    private LocalDate fechaNacimiento;
    private String medicamentosActuales;
    private List<UsuarioResponse> tutores;
    private List<UsuarioResponse> docentes;

    public static EstudianteResponse fromEntity(Estudiante estudiante) {
        EstudianteResponse response = new EstudianteResponse();
        response.matricula = estudiante.getMatricula();
        response.nombre = estudiante.getNombre();
        response.apellidos = estudiante.getApellidos();
        response.grado = estudiante.getGrado();
        response.grupo = estudiante.getGrupo();
        response.alergias = estudiante.getAlergias();
        response.condicionesCronicas = estudiante.getCondicionesCronicas();
        response.fechaNacimiento = estudiante.getFechaNacimiento();
        response.medicamentosActuales = estudiante.getMedicamentosActuales();
        response.tutores = estudiante.getTutores() == null
                ? List.of()
                : estudiante.getTutores().stream().map(UsuarioResponse::fromEntity).toList();
        response.docentes = estudiante.getDocentes() == null
                ? List.of()
                : estudiante.getDocentes().stream().map(UsuarioResponse::fromEntity).toList();
        return response;
    }

    public Integer getMatricula() { return matricula; }
    public String getNombre() { return nombre; }
    public String getApellidos() { return apellidos; }
    public Integer getGrado() { return grado; }
    public String getGrupo() { return grupo; }
    public String getAlergias() { return alergias; }
    public String getCondicionesCronicas() { return condicionesCronicas; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public String getMedicamentosActuales() { return medicamentosActuales; }
    public List<UsuarioResponse> getTutores() { return tutores; }
    public List<UsuarioResponse> getDocentes() { return docentes; }
}
