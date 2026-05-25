package com.sriae.dto;

public class EstadisticasInicioResponse {

    private long incidentesHoy;
    private long incidentesAyer;
    private long activos;
    private long resueltos;

    public EstadisticasInicioResponse(long incidentesHoy, long incidentesAyer, long activos, long resueltos) {
        this.incidentesHoy = incidentesHoy;
        this.incidentesAyer = incidentesAyer;
        this.activos = activos;
        this.resueltos = resueltos;
    }

    public long getIncidentesHoy() { return incidentesHoy; }
    public long getIncidentesAyer() { return incidentesAyer; }
    public long getActivos() { return activos; }
    public long getResueltos() { return resueltos; }
}
