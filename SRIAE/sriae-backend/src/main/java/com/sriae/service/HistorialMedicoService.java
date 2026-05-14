package com.sriae.service;

import com.sriae.dto.HistorialMedicoRequest;
import com.sriae.dto.HistorialMedicoResponse;
import com.sriae.exception.ResourceNotFoundException;
import com.sriae.model.Estudiante;
import com.sriae.model.HistorialMedico;
import com.sriae.model.Usuario;
import com.sriae.repository.EstudianteRepository;
import com.sriae.repository.HistorialMedicoRepository;
import com.sriae.repository.UsuarioRepository;
import com.sriae.util.RoleUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistorialMedicoService {

    private final HistorialMedicoRepository historialMedicoRepository;
    private final EstudianteRepository estudianteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    public HistorialMedicoService(
            HistorialMedicoRepository historialMedicoRepository,
            EstudianteRepository estudianteRepository,
            UsuarioRepository usuarioRepository,
            AuditoriaService auditoriaService) {
        this.historialMedicoRepository = historialMedicoRepository;
        this.estudianteRepository = estudianteRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<HistorialMedicoResponse> listar(Integer matricula, String correoUsuario) {
        Usuario usuario = obtenerUsuario(correoUsuario);
        List<HistorialMedico> historiales = matricula == null
                ? historialMedicoRepository.findAll()
                : historialMedicoRepository.findByEstudiante_MatriculaOrderByFechaRegistroDesc(matricula);

        return historiales.stream()
                .filter(historial -> puedeVerHistorial(usuario, historial))
                .map(HistorialMedicoResponse::fromEntity)
                .toList();
    }

    public HistorialMedicoResponse obtener(Integer id, String correoUsuario) {
        Usuario usuario = obtenerUsuario(correoUsuario);
        HistorialMedico historial = obtenerHistorial(id);
        if (!puedeVerHistorial(usuario, historial)) {
            throw new ResourceNotFoundException("Historial medico no encontrado");
        }
        return HistorialMedicoResponse.fromEntity(historial);
    }

    public HistorialMedicoResponse crear(HistorialMedicoRequest request, String correoUsuario) {
        HistorialMedico historial = new HistorialMedico();
        historial.setEstudiante(obtenerEstudiante(request.getMatriculaEstudiante()));
        historial.setUsuarioRegistra(obtenerUsuario(correoUsuario));
        aplicarDatos(historial, request);

        HistorialMedico guardado = historialMedicoRepository.save(historial);
        auditoriaService.registrar(correoUsuario, "CREO_HISTORIAL_MEDICO", "Historial: " + guardado.getIdHistorial());
        return HistorialMedicoResponse.fromEntity(guardado);
    }

    public HistorialMedicoResponse actualizar(Integer id, HistorialMedicoRequest request, String correoUsuario) {
        HistorialMedico historial = obtenerHistorial(id);
        historial.setEstudiante(obtenerEstudiante(request.getMatriculaEstudiante()));
        aplicarDatos(historial, request);

        HistorialMedico guardado = historialMedicoRepository.save(historial);
        auditoriaService.registrar(correoUsuario, "ACTUALIZO_HISTORIAL_MEDICO", "Historial: " + id);
        return HistorialMedicoResponse.fromEntity(guardado);
    }

    public void eliminar(Integer id, String correoUsuario) {
        HistorialMedico historial = obtenerHistorial(id);
        historialMedicoRepository.delete(historial);
        auditoriaService.registrar(correoUsuario, "ELIMINO_HISTORIAL_MEDICO", "Historial: " + id);
    }

    private HistorialMedico obtenerHistorial(Integer id) {
        return historialMedicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Historial medico no encontrado"));
    }

    private Estudiante obtenerEstudiante(Integer matricula) {
        return estudianteRepository.findById(matricula)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
    }

    private Usuario obtenerUsuario(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private boolean puedeVerHistorial(Usuario usuario, HistorialMedico historial) {
        String rol = RoleUtils.normalizeRole(usuario.getTipoUsuario());
        if ("ADMIN".equals(rol) || "MEDICO".equals(rol)) {
            return true;
        }

        Estudiante estudiante = historial.getEstudiante();
        if (estudiante == null) {
            return false;
        }

        if ("DOCENTE".equals(rol)) {
            return estaRelacionado(estudiante.getDocentes(), usuario.getIdUsuario());
        }

        return false;
    }

    private boolean estaRelacionado(List<Usuario> usuarios, Integer idUsuario) {
        return usuarios != null && usuarios.stream().anyMatch(usuario -> usuario.getIdUsuario().equals(idUsuario));
    }

    private void aplicarDatos(HistorialMedico historial, HistorialMedicoRequest request) {
        historial.setTipoSangre(request.getTipoSangre());
        historial.setAlergias(request.getAlergias());
        historial.setEnfermedadesCronicas(request.getEnfermedadesCronicas());
        historial.setMedicamentos(request.getMedicamentos());
        historial.setObservaciones(request.getObservaciones());
    }
}
