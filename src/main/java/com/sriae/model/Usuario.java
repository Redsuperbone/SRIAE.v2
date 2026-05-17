package com.sriae.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "apellido_completo", nullable = false)
    private String apellidoCompleto;

    // SOLUCIÓN: Usamos @JsonProperty para que Spring entienda el JSON
    @JsonProperty("correoElectronico")
    @JsonAlias("correo")
    @Column(name = "correo_electronico", nullable = false, unique = true)
    private String correo;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "tipo_usuario", nullable = false)
    private String tipoUsuario;

    @Column(name = "foto_ruta")
    private String fotoRuta;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // ===== GETTERS Y SETTERS =====

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getApellidoCompleto() { return apellidoCompleto; }
    public void setApellidoCompleto(String apellidoCompleto) { this.apellidoCompleto = apellidoCompleto; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }

    public String getFotoRuta() { return fotoRuta; }
    public void setFotoRuta(String fotoRuta) { this.fotoRuta = fotoRuta; }
}
