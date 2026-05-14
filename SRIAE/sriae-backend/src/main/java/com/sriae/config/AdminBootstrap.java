package com.sriae.config;

import com.sriae.model.Usuario;
import com.sriae.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdminBootstrap implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;
    private final String nombre;
    private final String apellido;

    public AdminBootstrap(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${sriae.admin.email:}") String email,
            @Value("${sriae.admin.password:}") String password,
            @Value("${sriae.admin.nombre:Administrador}") String nombre,
            @Value("${sriae.admin.apellido:SRIAE}") String apellido) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.apellido = apellido;
    }

    @Override
    public void run(String... args) {
        if (email.isBlank() || password.isBlank()) {
            return;
        }

        boolean adminExists = usuarioRepository.existsByTipoUsuarioIn(List.of("ADMIN", "ADMINISTRADOR"));
        if (adminExists || usuarioRepository.findByCorreo(email).isPresent()) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setNombreCompleto(nombre);
        admin.setApellidoCompleto(apellido);
        admin.setCorreo(email);
        admin.setTipoUsuario("ADMIN");
        admin.setContrasena(passwordEncoder.encode(password));
        usuarioRepository.save(admin);
    }
}
