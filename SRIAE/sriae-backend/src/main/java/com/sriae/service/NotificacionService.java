package com.sriae.service;

import com.sriae.dto.NotificacionResponse;
import com.sriae.exception.BadRequestException;
import com.sriae.exception.ResourceNotFoundException;
import com.sriae.model.Incidente;
import com.sriae.model.Notificacion;
import com.sriae.model.Usuario;
import com.sriae.repository.NotificacionRepository;
import com.sriae.repository.UsuarioRepository;
import com.sriae.util.RoleUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CorreoIncidenteService correoIncidenteService;

    public NotificacionService(
            NotificacionRepository notificacionRepository,
            UsuarioRepository usuarioRepository,
            CorreoIncidenteService correoIncidenteService) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.correoIncidenteService = correoIncidenteService;
    }

    public void notificarIncidenteRelevante(Incidente incidente) {
        if (!requiereNotificacion(incidente)) {
            return;
        }

        Set<Usuario> destinatarios = new HashSet<>(usuarioRepository.findByTipoUsuarioIn(List.of("ADMIN", "DIRECTOR", "ADMINISTRADOR")));
        if (incidente.getEstudiante() != null && incidente.getEstudiante().getTutores() != null) {
            destinatarios.addAll(incidente.getEstudiante().getTutores());
        }

        for (Usuario destinatario : destinatarios) {
            crear(destinatario, incidente);
        }

        correoIncidenteService.enviarAvisoATutores(incidente);
    }

    public List<NotificacionResponse> listar() {
        return notificacionRepository.findAll()
                .stream()
                .map(NotificacionResponse::fromEntity)
                .toList();
    }

    public List<NotificacionResponse> listarPorUsuario(Integer idUsuario, String correoSolicitante) {
        Usuario solicitante = usuarioRepository.findByCorreo(correoSolicitante)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        boolean esAdmin = "ADMIN".equals(RoleUtils.normalizeRole(solicitante.getTipoUsuario()));
        if (!esAdmin && !solicitante.getIdUsuario().equals(idUsuario)) {
            throw new AccessDeniedException("No puedes consultar notificaciones de otro usuario");
        }

        return notificacionRepository.findByUsuarioDestino_IdUsuarioOrderByFechaCreacionDesc(idUsuario)
                .stream()
                .map(NotificacionResponse::fromEntity)
                .toList();
    }

    public NotificacionResponse marcarComoLeida(Integer id, String correoSolicitante) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificacion no encontrada"));

        Usuario solicitante = usuarioRepository.findByCorreo(correoSolicitante)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        boolean esAdmin = "ADMIN".equals(RoleUtils.normalizeRole(solicitante.getTipoUsuario()));
        if (!esAdmin && !notificacion.getUsuarioDestino().getIdUsuario().equals(solicitante.getIdUsuario())) {
            throw new AccessDeniedException("No puedes modificar notificaciones de otro usuario");
        }

        notificacion.setLeida(true);
        return NotificacionResponse.fromEntity(notificacionRepository.save(notificacion));
    }

    private boolean requiereNotificacion(Incidente incidente) {
        String nivel = incidente.getNivelAlerta() == null ? "" : incidente.getNivelAlerta().toUpperCase();
        String tipo = incidente.getTipo() == null ? "" : incidente.getTipo().toUpperCase();
        return nivel.contains("GRAVE")
                || nivel.contains("ALTA")
                || nivel.contains("CRITICA")
                || nivel.contains("CRÍTICA")
                || tipo.contains("MEDIC")
                || tipo.contains("MÉDIC");
    }

    private void crear(Usuario destinatario, Incidente incidente) {
        if (destinatario == null || destinatario.getIdUsuario() == null) {
            throw new BadRequestException("Destinatario de notificacion invalido");
        }

        Notificacion notificacion = new Notificacion();
        notificacion.setUsuarioDestino(destinatario);
        notificacion.setIncidente(incidente);
        notificacion.setTitulo("Incidencia relevante registrada");
        notificacion.setMensaje("Se registro una incidencia " + incidente.getTipo() + " con alerta " + incidente.getNivelAlerta());
        notificacionRepository.save(notificacion);
    }
}
