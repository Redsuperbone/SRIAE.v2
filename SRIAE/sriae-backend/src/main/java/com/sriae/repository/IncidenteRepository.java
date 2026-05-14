package com.sriae.repository;

import com.sriae.model.Incidente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncidenteRepository extends JpaRepository<Incidente, Integer> {

    List<Incidente> findByEstado(String estado);

    List<Incidente> findByNivelAlerta(String nivelAlerta);

    List<Incidente> findByUsuarioReporta_IdUsuario(Integer idUsuario);

    List<Incidente> findByEstudiante_Matricula(Integer matricula);

    @Query("SELECT i FROM Incidente i JOIN i.estudiante e JOIN e.tutores t WHERE t.idUsuario = :idTutor")
    List<Incidente> findByTutorId(@Param("idTutor") Integer idTutor);

    @Query("SELECT i FROM Incidente i JOIN i.estudiante e JOIN e.docentes d WHERE d.idUsuario = :idDocente")
    List<Incidente> findByDocenteId(@Param("idDocente") Integer idDocente);

    @Query("SELECT COALESCE(i.nivelAlerta, 'SIN_CLASIFICAR'), COUNT(i) FROM Incidente i GROUP BY i.nivelAlerta")
    List<Object[]> countByTipo();

    @Query("SELECT e.matricula, CONCAT(CONCAT(e.nombre, ' '), e.apellidos), COUNT(i) FROM Incidente i JOIN i.estudiante e GROUP BY e.matricula, e.nombre, e.apellidos")
    List<Object[]> countByAlumno();

    @Query("SELECT YEAR(i.fechaIncidente), MONTH(i.fechaIncidente), COUNT(i) FROM Incidente i WHERE i.fechaIncidente IS NOT NULL GROUP BY YEAR(i.fechaIncidente), MONTH(i.fechaIncidente)")
    List<Object[]> countByMes();
}
