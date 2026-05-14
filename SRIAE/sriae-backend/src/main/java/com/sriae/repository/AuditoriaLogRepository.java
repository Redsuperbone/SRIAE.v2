package com.sriae.repository;

import com.sriae.model.AuditoriaLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditoriaLogRepository extends JpaRepository<AuditoriaLog, Integer> {

    List<AuditoriaLog> findByUsuarioOrderByFechaDesc(String usuario);
}
