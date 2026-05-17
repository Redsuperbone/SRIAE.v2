package com.sriae.dto;

public class LoginResponse {

    private String mensaje;
    private String tipoUsuario;
    private Integer idUsuario;
    private String nombre;
    private String token;
    private String tipo;

    public LoginResponse(String mensaje, String tipoUsuario, Integer idUsuario, String nombre, String token) {
        this.mensaje = mensaje;
        this.tipoUsuario = tipoUsuario;
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.token = token;
        this.tipo = "Bearer";
    }

    // GETTERS Y SETTERS

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }
}
