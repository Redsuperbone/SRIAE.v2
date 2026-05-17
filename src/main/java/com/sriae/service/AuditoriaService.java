package com.sriae.service;

import com.sriae.dto.AuditoriaLogResponse;
import com.sriae.model.AuditoriaLog;
import com.sriae.repository.AuditoriaLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaLogRepository auditoriaLogRepository;

    public AuditoriaService(AuditoriaLogRepository auditoriaLogRepository) {
        this.auditoriaLogRepository = auditoriaLogRepository;
    }

    public void registrar(String usuario, String accion, String detalle) {
        AuditoriaLog log = new AuditoriaLog();
        log.setUsuario(usuario);
        log.setAccion(accion);
        log.setDetalle(detalle);
        auditoriaLogRepository.save(log);
    }

    public List<AuditoriaLogResponse> listar(String usuario) {
        List<AuditoriaLog> logs = usuario == null || usuario.isBlank()
                ? auditoriaLogRepository.findAll()
                : auditoriaLogRepository.findByUsuarioOrderByFechaDesc(usuario);

        return logs.stream().map(AuditoriaLogResponse::fromEntity).toList();
    }
}
