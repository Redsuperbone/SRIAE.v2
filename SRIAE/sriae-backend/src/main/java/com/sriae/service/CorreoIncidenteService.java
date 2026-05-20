package com.sriae.service;

import com.sriae.model.Estudiante;
import com.sriae.model.Incidente;
import com.sriae.model.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CorreoIncidenteService {

    private static final Logger logger = LoggerFactory.getLogger(CorreoIncidenteService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final boolean enabled;
    private final String from;

    public CorreoIncidenteService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${sriae.email.enabled:false}") boolean enabled,
            @Value("${spring.mail.username:}") String from) {
        this.mailSenderProvider = mailSenderProvider;
        this.enabled = enabled;
        this.from = from;
    }

    @PostConstruct
    public void logConfiguracion() {
        logger.info("Correo de incidentes: enabled={}, fromConfigurado={}", enabled, from != null && !from.isBlank());
    }

    @Async
    public void enviarAvisoATutores(Incidente incidente) {
        try {
            if (!enabled) {
                logger.info("Envio automatico de correos desactivado. Define SRIAE_EMAIL_ENABLED=true y spring.mail.* para activarlo.");
                return;
            }

            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) {
                logger.warn("No hay JavaMailSender configurado. No se enviaron correos del incidente {}.", incidente.getIdIncidente());
                return;
            }

            Estudiante estudiante = incidente.getEstudiante();
            List<Usuario> tutores = estudiante != null && estudiante.getTutores() != null
                    ? estudiante.getTutores()
                    : List.of();

            logger.info("Preparando correo de incidente {} para {} tutor(es).",
                    incidente.getIdIncidente(),
                    tutores.size());

            int enviados = 0;
            for (Usuario tutor : tutores) {
                if (tutor.getCorreo() == null || tutor.getCorreo().isBlank()) {
                    logger.info("Tutor {} omitido porque no tiene correo.", tutor.getIdUsuario());
                    continue;
                }
                enviar(mailSender, tutor, incidente);
                enviados++;
            }
            logger.info("Proceso de correos del incidente {} terminado. Destinatarios intentados: {}.",
                    incidente.getIdIncidente(),
                    enviados);
        } catch (Exception error) {
            logger.warn("No fue posible procesar los correos del incidente {}: {}",
                    incidente != null ? incidente.getIdIncidente() : "desconocido",
                    error.getMessage());
        }
    }

    private void enviar(JavaMailSender mailSender, Usuario tutor, Incidente incidente) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (from != null && !from.isBlank()) {
            message.setFrom(from);
        }
        message.setTo(tutor.getCorreo());
        message.setSubject("Aviso formal de incidente escolar");
        message.setText(construirMensaje(tutor, incidente));

        try {
            mailSender.send(message);
        } catch (MailException error) {
            logger.warn("No fue posible enviar el correo del incidente {} a {}: {}",
                    incidente.getIdIncidente(),
                    tutor.getCorreo(),
                    error.getMessage());
        }
    }

    private String construirMensaje(Usuario tutor, Incidente incidente) {
        Usuario actor = incidente.getUsuarioReporta();
        Estudiante estudiante = incidente.getEstudiante();
        String nombreTutor = nombreCompleto(tutor);
        String nombreActor = nombreCompleto(actor);
        String rolActor = actor != null && actor.getTipoUsuario() != null ? actor.getTipoUsuario() : "personal autorizado";
        String fecha = incidente.getFechaIncidente() != null
                ? incidente.getFechaIncidente().format(DATE_FORMAT)
                : "sin fecha registrada";

        return """
                Estimado(a) %s:

                Por medio del presente se le informa que se ha registrado un incidente escolar relacionado con el/la estudiante %s.

                Este aviso se genera automaticamente por el Sistema de Registro de Incidentes y Alertas Escolares (SRIAE), a partir del registro realizado por %s, con rol de %s.

                Detalles del incidente:
                - Folio: %s
                - Tipo de incidente: %s
                - Nivel de alerta: %s
                - Lugar: %s
                - Fecha y hora de registro: %s
                - Descripcion: %s

                Le solicitamos mantenerse atento(a) a los medios de contacto registrados. En caso de requerirse seguimiento inmediato, el personal escolar podra comunicarse telefonicamente o por WhatsApp.

                Atentamente,
                Sistema de Registro de Incidentes y Alertas Escolares (SRIAE)

                Este correo fue generado automaticamente. Por favor, no responda directamente a este mensaje.
                """.formatted(
                valor(nombreTutor, "Tutor"),
                estudiante != null ? estudiante.getNombre() + " " + estudiante.getApellidos() : "un estudiante",
                valor(nombreActor, "un usuario autorizado"),
                valor(rolActor, "personal autorizado"),
                valor(incidente.getIdIncidente(), "sin folio"),
                valor(incidente.getTitulo(), "No especificado"),
                valor(incidente.getNivelAlerta(), "No especificado"),
                valor(incidente.getUbicacion(), "No especificado"),
                fecha,
                valor(incidente.getDescripcion(), "Sin descripcion"));
    }

    private String nombreCompleto(Usuario usuario) {
        if (usuario == null) {
            return "";
        }
        return ((usuario.getNombreCompleto() == null ? "" : usuario.getNombreCompleto()) + " "
                + (usuario.getApellidoCompleto() == null ? "" : usuario.getApellidoCompleto())).trim();
    }

    private String valor(Object value, String fallback) {
        if (value == null) {
            return fallback;
        }
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? fallback : text;
    }
}
