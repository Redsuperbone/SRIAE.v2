package com.sriae.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UsuarioPerfilUpdateRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombreCompleto;

    private String apellidoCompleto;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato valido")
    @JsonProperty("correoElectronico")
    @JsonAlias("correo")
    private String correoElectronico;

    private String telefono;

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    public String getApellidoCompleto() { return apellidoCompleto; }
    public void setApellidoCompleto(String apellidoCompleto) { this.apellidoCompleto = apellidoCompleto; }
    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}
