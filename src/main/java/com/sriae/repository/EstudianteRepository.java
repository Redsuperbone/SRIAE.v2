package com.sriae.repository;

import com.sriae.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {

    List<Estudiante> findByNombreContainingIgnoreCaseOrApellidosContainingIgnoreCase(String nombre, String apellidos);

    List<Estudiante> findByGrupoIgnoreCase(String grupo);
}
