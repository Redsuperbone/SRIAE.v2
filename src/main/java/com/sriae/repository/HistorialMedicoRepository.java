package com.sriae.repository;

import com.sriae.model.HistorialMedico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Integer> {

    List<HistorialMedico> findByEstudiante_MatriculaOrderByFechaRegistroDesc(Integer matricula);
}
