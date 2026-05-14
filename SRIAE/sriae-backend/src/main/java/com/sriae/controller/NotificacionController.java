package com.sriae.controller;

import com.sriae.dto.NotificacionResponse;
import com.sriae.service.NotificacionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin("*")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR')")
    public List<NotificacionResponse> listar() {
        return notificacionService.listar();
    }

    @GetMapping("/usuario/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','TUTOR','DOCENTE','MEDICO','ALUMNO')")
    public List<NotificacionResponse> listarPorUsuario(@PathVariable Integer id, Authentication authentication) {
        return notificacionService.listarPorUsuario(id, authentication.getName());
    }

    @PutMapping("/{id}/leida")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','TUTOR','DOCENTE','MEDICO','ALUMNO')")
    public NotificacionResponse marcarComoLeida(@PathVariable Integer id, Authentication authentication) {
        return notificacionService.marcarComoLeida(id, authentication.getName());
    }
}
