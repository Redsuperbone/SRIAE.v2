package com.sriae.dto;

import com.sriae.model.AuditoriaLog;

import java.time.LocalDateTime;

public class AuditoriaLogResponse {

    private Integer idAuditoria;
    private String usuario;
    private String accion;
    private String detalle;
    private LocalDateTime fecha;

    public static AuditoriaLogResponse fromEntity(AuditoriaLog log) {
        AuditoriaLogResponse response = new AuditoriaLogResponse();
        response.idAuditoria = log.getIdAuditoria();
        response.usuario = log.getUsuario();
        response.accion = log.getAccion();
        response.detalle = log.getDetalle();
        response.fecha = log.getFecha();
        return response;
    }

    public Integer getIdAuditoria() { return idAuditoria; }
    public String getUsuario() { return usuario; }
    public String getAccion() { return accion; }
    public String getDetalle() { return detalle; }
    public LocalDateTime getFecha() { return fecha; }
}
