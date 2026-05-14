package com.sriae.dto;

import com.sriae.model.Notificacion;

import java.time.LocalDateTime;

public class NotificacionResponse {

    private Integer idNotificacion;
    private Integer idUsuarioDestino;
    private String usuarioDestino;
    private Integer idIncidente;
    private String titulo;
    private String mensaje;
    private Boolean leida;
    private LocalDateTime fechaCreacion;

    public static NotificacionResponse fromEntity(Notificacion notificacion) {
        NotificacionResponse response = new NotificacionResponse();
        response.idNotificacion = notificacion.getIdNotificacion();
        response.titulo = notificacion.getTitulo();
        response.mensaje = notificacion.getMensaje();
        response.leida = notificacion.getLeida();
        response.fechaCreacion = notificacion.getFechaCreacion();

        if (notificacion.getUsuarioDestino() != null) {
            response.idUsuarioDestino = notificacion.getUsuarioDestino().getIdUsuario();
            response.usuarioDestino = notificacion.getUsuarioDestino().getNombreCompleto();
        }

        if (notificacion.getIncidente() != null) {
            response.idIncidente = notificacion.getIncidente().getIdIncidente();
        }

        return response;
    }

    public Integer getIdNotificacion() { return idNotificacion; }
    public Integer getIdUsuarioDestino() { return idUsuarioDestino; }
    public String getUsuarioDestino() { return usuarioDestino; }
    public Integer getIdIncidente() { return idIncidente; }
    public String getTitulo() { return titulo; }
    public String getMensaje() { return mensaje; }
    public Boolean getLeida() { return leida; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}
