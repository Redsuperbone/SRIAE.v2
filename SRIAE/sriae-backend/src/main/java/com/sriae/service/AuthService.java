package com.sriae.service;

import com.sriae.dto.LoginRequest;
import com.sriae.dto.LoginResponse;
import com.sriae.dto.UsuarioRegistroRequest;
import com.sriae.exception.BadRequestException;
import com.sriae.exception.ResourceNotFoundException;
import com.sriae.model.Usuario;
import com.sriae.repository.UsuarioRepository;
import com.sriae.security.JwtUtil;
import com.sriae.util.RoleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
