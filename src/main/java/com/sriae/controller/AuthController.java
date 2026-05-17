package com.sriae.controller;

import com.sriae.dto.LoginRequest;
import com.sriae.dto.LoginResponse;
import com.sriae.dto.RecuperacionContrasenaRequest;
import com.sriae.dto.RestablecerContrasenaRequest;
import com.sriae.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/recuperar")
    public ResponseEntity<Void> solicitarRecuperacion(@Valid @RequestBody RecuperacionContrasenaRequest request) {
        authService.solicitarRecuperacion(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/restablecer")
    public ResponseEntity<Void> restablecerContrasena(@Valid @RequestBody RestablecerContrasenaRequest request) {
        authService.restablecerContrasena(request);
        return ResponseEntity.noContent().build();
    }
}
