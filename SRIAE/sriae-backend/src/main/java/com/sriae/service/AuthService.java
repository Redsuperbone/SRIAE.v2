package com.sriae.service;

import com.sriae.dto.LoginRequest;
import com.sriae.dto.LoginResponse;
import com.sriae.dto.RecuperacionContrasenaRequest;
import com.sriae.dto.RestablecerContrasenaRequest;
import com.sriae.dto.UsuarioRegistroRequest;
import com.sriae.exception.BadRequestException;
import com.sriae.exception.ResourceNotFoundException;
import com.sriae.model.RecuperacionContrasenaToken;
import com.sriae.model.Usuario;
import com.sriae.repository.RecuperacionContrasenaTokenRepository;
import com.sriae.repository.UsuarioRepository;
import com.sriae.security.JwtUtil;
import com.sriae.util.RoleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuditoriaService auditoriaService;
    @Autowired
    private RecuperacionContrasenaTokenRepository recuperacionTokenRepository;
    @Autowired
    private CorreoRecuperacionService correoRecuperacionService;
    @Autowired
    private TransactionTemplate transactionTemplate;

    private static final int MINUTOS_VIGENCIA_RECUPERACION = 30;

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreoElectronico())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            throw new BadRequestException("Contrasena incorrecta");
        }

        String rol = RoleUtils.normalizeRole(usuario.getTipoUsuario());
        String token = jwtUtil.generateToken(usuario.getCorreo(), rol);
        auditoriaService.registrar(usuario.getCorreo(), "INICIO_SESION", "Login correcto");
        return new LoginResponse("Login correcto", rol, usuario.getIdUsuario(), usuario.getNombreCompleto(), token);
    }

    public Usuario registrar(UsuarioRegistroRequest request) {
        return registrar(request, false);
    }

    public Usuario registrar(UsuarioRegistroRequest request, boolean permitirAdmin) {
        if (usuarioRepository.findByCorreo(request.getCorreoElectronico()).isPresent()) {
            throw new BadRequestException("El correo ya esta registrado");
        }

        String rol = RoleUtils.normalizeRole(request.getTipoUsuario());
        boolean adminExiste = usuarioRepository.existsByTipoUsuarioIn(List.of("ADMIN", "ADMINISTRADOR"));
        if ("ADMIN".equals(rol) && adminExiste && !permitirAdmin) {
            throw new BadRequestException("El registro publico no puede crear administradores");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setApellidoCompleto(request.getApellidoCompleto() == null ? "" : request.getApellidoCompleto());
        usuario.setCorreo(request.getCorreoElectronico());
        usuario.setTelefono(request.getTelefono());
        usuario.setTipoUsuario(rol);
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));

        Usuario guardado = usuarioRepository.save(usuario);
        auditoriaService.registrar(guardado.getCorreo(), "REGISTRO_USUARIO", "Rol: " + guardado.getTipoUsuario());
        return guardado;
    }

    public void solicitarRecuperacion(RecuperacionContrasenaRequest request) {
        RecuperacionPendiente pendiente = transactionTemplate.execute(status -> {
            Usuario usuario = usuarioRepository.findByCorreo(request.getCorreoElectronico())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

            recuperacionTokenRepository.deleteByFechaExpiracionBefore(LocalDateTime.now());
            recuperacionTokenRepository.deleteByUsuarioAndUsadoFalse(usuario);

            RecuperacionContrasenaToken token = new RecuperacionContrasenaToken();
            token.setUsuario(usuario);
            token.setToken(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""));
            token.setFechaExpiracion(LocalDateTime.now().plusMinutes(MINUTOS_VIGENCIA_RECUPERACION));
            token.setUsado(false);
            recuperacionTokenRepository.save(token);

            auditoriaService.registrar(usuario.getCorreo(), "SOLICITO_RECUPERACION_CONTRASENA", "Token de recuperacion generado");
            return new RecuperacionPendiente(usuario.getCorreo(), usuario.getNombreCompleto(), token.getToken());
        });

        correoRecuperacionService.enviarEnlace(
                pendiente.correo(),
                pendiente.nombreCompleto(),
                pendiente.token(),
                MINUTOS_VIGENCIA_RECUPERACION);
    }

    @Transactional
    public void restablecerContrasena(RestablecerContrasenaRequest request) {
        RecuperacionContrasenaToken token = recuperacionTokenRepository.findByTokenAndUsadoFalse(request.getToken())
                .orElseThrow(() -> new BadRequestException("Token de recuperacion invalido"));

        if (token.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            token.setUsado(true);
            recuperacionTokenRepository.save(token);
            throw new BadRequestException("El enlace de recuperacion expiro");
        }

        Usuario usuario = token.getUsuario();
        usuario.setContrasena(passwordEncoder.encode(request.getNuevaContrasena()));
        usuarioRepository.save(usuario);

        token.setUsado(true);
        recuperacionTokenRepository.save(token);
        auditoriaService.registrar(usuario.getCorreo(), "RESTABLECIO_CONTRASENA", "Contrasena actualizada mediante recuperacion");
    }

    private record RecuperacionPendiente(String correo, String nombreCompleto, String token) {
    }
}
