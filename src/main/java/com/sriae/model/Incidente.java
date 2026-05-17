package com.sriae.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidente")
public class Incidente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incidente")
    private Integer idIncidente;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "ubicacion")
    private String ubicacion;

    @Transient
    private String tipo;

    @Column(name = "nivel_alerta")
    private String nivelAlerta;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha_incidente")
    private LocalDateTime fechaIncidente;

    @Column(name = "foto_ruta")
    private String fotoRuta;

    @ManyToOne
    @JoinColumn(name = "id_usuario_reporta", nullable = false)
    private Usuario usuarioReporta;

    @ManyToOne
    @JoinColumn(name = "id_estudiante_involucrado")
    private Estudiante estudiante;

    public Integer getIdIncidente() { return idIncidente; }
    public void setIdIncidente(Integer idIncidente) { this.idIncidente = idIncidente; }
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
    public LocalDateTime getFechaIncidente() { return fechaIncidente; }
    public void setFechaIncidente(LocalDateTime fechaIncidente) { this.fechaIncidente = fechaIncidente; }
    public String getFotoRuta() { return fotoRuta; }
    public void setFotoRuta(String fotoRuta) { this.fotoRuta = fotoRuta; }
    public Usuario getUsuarioReporta() { return usuarioReporta; }
    public void setUsuarioReporta(Usuario usuarioReporta) { this.usuarioReporta = usuarioReporta; }
    public Estudiante getEstudiante() { return estudiante; }
    public void setEstudiante(Estudiante estudiante) { this.estudiante = estudiante; }
}
