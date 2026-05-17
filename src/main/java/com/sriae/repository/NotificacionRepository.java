package com.sriae.repository;

import com.sriae.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {

    List<Notificacion> findByUsuarioDestino_IdUsuarioOrderByFechaCreacionDesc(Integer idUsuario);
}
