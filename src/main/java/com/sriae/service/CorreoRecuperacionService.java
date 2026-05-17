package com.sriae.service;

import com.sriae.exception.BadRequestException;
import com.sriae.model.Usuario;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class CorreoRecuperacionService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final boolean enabled;
    private final String from;
    private final String frontendBaseUrl;

    public CorreoRecuperacionService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${sriae.email.enabled:false}") boolean enabled,
            @Value("${spring.mail.username:}") String from,
            @Value("${sriae.frontend.base-url:http://localhost:5500/src/pages}") String frontendBaseUrl) {
        this.mailSenderProvider = mailSenderProvider;
        this.enabled = enabled;
        this.from = from;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    public void enviarEnlace(Usuario usuario, String token, int minutosVigencia) {
        if (!enabled) {
            throw new BadRequestException("El envio de correos no esta configurado");
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            throw new BadRequestException("No hay servicio SMTP disponible");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (from != null && !from.isBlank()) {
            message.setFrom(from);
        }
        message.setTo(usuario.getCorreo());
        message.setSubject("Recuperacion de contrasena SRIAE");
        message.setText(construirMensaje(usuario, token, minutosVigencia));

        try {
            mailSender.send(message);
        } catch (MailException error) {
            throw new BadRequestException("No fue posible enviar el correo de recuperacion");
        }
    }

    private String construirMensaje(Usuario usuario, String token, int minutosVigencia) {
        String base = frontendBaseUrl.endsWith("/")
                ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
                : frontendBaseUrl;
        String enlace = base + "/recuperar.html?token=" + token;
        String nombre = usuario.getNombreCompleto() == null || usuario.getNombreCompleto().isBlank()
                ? "usuario"
                : usuario.getNombreCompleto();

        return """
                Hola %s:

                Recibimos una solicitud para restablecer tu contrasena en SRIAE.

                Usa el siguiente enlace para crear una nueva contrasena:
                %s

                Este enlace vence en %d minutos. Si no solicitaste este cambio, ignora este correo.

                Sistema de Registro de Incidentes y Alertas Escolares (SRIAE)
                """.formatted(nombre, enlace, minutosVigencia);
    }
}
