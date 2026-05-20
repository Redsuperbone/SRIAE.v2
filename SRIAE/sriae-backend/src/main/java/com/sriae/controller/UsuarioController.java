package com.sriae.controller;

import com.sriae.dto.UsuarioRegistroRequest;
import com.sriae.dto.UsuarioEstadoRequest;
import com.sriae.dto.UsuarioPerfilUpdateRequest;
import com.sriae.dto.UsuarioResponse;
import com.sriae.exception.BadRequestException;
import com.sriae.exception.ResourceNotFoundException;
import com.sriae.model.Usuario;
import com.sriae.repository.UsuarioRepository;
import com.sriae.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    public UsuarioController(UsuarioRepository usuarioRepository, AuthService authService) {
        this.usuarioRepository = usuarioRepository;
        this.authService = authService;
    }

    @GetMapping("/perfil")
    public UsuarioResponse perfil(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByCorreo(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return UsuarioResponse.fromEntity(usuario);
    }

    @PutMapping("/perfil")
    public UsuarioResponse actualizarPerfil(
            Authentication authentication,
            @Valid @RequestBody UsuarioPerfilUpdateRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuarioRepository.findByCorreo(request.getCorreoElectronico())
                .filter(encontrado -> !encontrado.getIdUsuario().equals(usuario.getIdUsuario()))
                .ifPresent(encontrado -> {
                    throw new BadRequestException("El correo ya esta registrado");
                });

        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setApellidoCompleto(request.getApellidoCompleto() == null ? "" : request.getApellidoCompleto());
        usuario.setCorreo(request.getCorreoElectronico());
        usuario.setTelefono(request.getTelefono());

        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioResponse> listar(@RequestParam(required = false) String rol) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        if (rol != null && !rol.isBlank()) {
            String rolNormalizado = com.sriae.util.RoleUtils.normalizeRole(rol);
            usuarios = usuarios.stream()
                    .filter(usuario -> rolNormalizado.equals(com.sriae.util.RoleUtils.normalizeRole(usuario.getTipoUsuario())))
                    .toList();
        }

        return usuarios
                .stream()
                .filter(usuario -> !usuario.isEliminado())
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody UsuarioRegistroRequest request) {
        Usuario usuario = authService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.fromEntity(usuario));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioRegistroRequest request) {
        Usuario usuario = authService.registrar(request, true);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.fromEntity(usuario));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse actualizarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioEstadoRequest request,
            Authentication authentication) {
        Usuario usuario = usuarioRepository.findById(id)
                .filter(encontrado -> !encontrado.isEliminado())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        validarNoEsCuentaPropia(usuario, authentication, "No puedes cambiar el estado de tu propia cuenta");

        usuario.setActivo(request.getActivo());
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id, Authentication authentication) {
        Usuario usuario = usuarioRepository.findById(id)
                .filter(encontrado -> !encontrado.isEliminado())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        validarNoEsCuentaPropia(usuario, authentication, "No puedes eliminar tu propia cuenta");

        usuario.setActivo(false);
        usuario.setEliminado(true);
        usuarioRepository.save(usuario);
        return ResponseEntity.noContent().build();
    }

    private void validarNoEsCuentaPropia(Usuario usuario, Authentication authentication, String mensaje) {
        if (usuario.getCorreo().equalsIgnoreCase(authentication.getName())) {
            throw new BadRequestException(mensaje);
        }
    }
}
