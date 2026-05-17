package com.sriae.repository;

import com.sriae.model.RecuperacionContrasenaToken;
import com.sriae.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RecuperacionContrasenaTokenRepository extends JpaRepository<RecuperacionContrasenaToken, Integer> {

    Optional<RecuperacionContrasenaToken> findByTokenAndUsadoFalse(String token);

    void deleteByUsuarioAndUsadoFalse(Usuario usuario);

    void deleteByFechaExpiracionBefore(LocalDateTime fecha);
}
