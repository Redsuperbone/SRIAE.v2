package com.sriae.dto;

import java.util.Map;

public class EstadisticasIncidenciasResponse {

    private long total;
    private Map<String, Long> porTipo;
    private Map<String, Long> porAlumno;
    private Map<String, Long> porMes;

    public EstadisticasIncidenciasResponse(long total, Map<String, Long> porTipo, Map<String, Long> porAlumno, Map<String, Long> porMes) {
        this.total = total;
        this.porTipo = porTipo;
        this.porAlumno = porAlumno;
        this.porMes = porMes;
    }

    public long getTotal() { return total; }
    public Map<String, Long> getPorTipo() { return porTipo; }
    public Map<String, Long> getPorAlumno() { return porAlumno; }
    public Map<String, Long> getPorMes() { return porMes; }
}
