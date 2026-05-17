package com.sriae.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "El correo es obligatorio")
    @JsonProperty("correoElectronico")
    @JsonAlias("correo")
    private String correoElectronico;

    @NotBlank(message = "La contrasena es obligatoria")
    private String contrasena;

    // Getters y Setters
    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}
