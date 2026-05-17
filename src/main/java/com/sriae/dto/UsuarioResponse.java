package com.sriae.dto;

import com.sriae.model.Usuario;
import com.sriae.util.RoleUtils;

public class UsuarioResponse {

    private Integer idUsuario;
    private String nombreCompleto;
    private String apellidoCompleto;
    private String correo;
    private String telefono;
    private String tipoUsuario;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.idUsuario = usuario.getIdUsuario();
        response.nombreCompleto = usuario.getNombreCompleto();
        response.apellidoCompleto = usuario.getApellidoCompleto();
        response.correo = usuario.getCorreo();
        response.telefono = usuario.getTelefono();
        response.tipoUsuario = RoleUtils.normalizeRole(usuario.getTipoUsuario());
        return response;
    }

    public Integer getIdUsuario() { return idUsuario; }
    public String getNombreCompleto() { return nombreCompleto; }
    public String getApellidoCompleto() { return apellidoCompleto; }
    public String getCorreo() { return correo; }
    public String getTelefono() { return telefono; }
    public String getTipoUsuario() { return tipoUsuario; }
}
