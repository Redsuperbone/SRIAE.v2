package com.sriae.repository;

import com.sriae.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByTipoUsuarioIn(Collection<String> tiposUsuario);
    List<Usuario> findByTipoUsuarioIn(Collection<String> tiposUsuario);
}
