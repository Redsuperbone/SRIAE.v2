package com.sriae.service;

import com.sriae.dto.EstudianteRequest;
import com.sriae.dto.EstudianteResponse;
import com.sriae.dto.UsuarioResponse;
import com.sriae.exception.BadRequestException;
import com.sriae.exception.ResourceNotFoundException;
import com.sriae.model.Estudiante;
import com.sriae.model.Tutor;
import com.sriae.model.Usuario;
import com.sriae.repository.EstudianteRepository;
import com.sriae.repository.TutorRepository;
import com.sriae.repository.UsuarioRepository;
import com.sriae.util.RoleUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final UsuarioRepository usuarioRepository;
    private final TutorRepository tutorRepository;
    private final AuditoriaService auditoriaService;

    public EstudianteService(
            EstudianteRepository estudianteRepository,
            UsuarioRepository usuarioRepository,
            TutorRepository tutorRepository,
            AuditoriaService auditoriaService) {
        this.estudianteRepository = estudianteRepository;
        this.usuarioRepository = usuarioRepository;
        this.tutorRepository = tutorRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<EstudianteResponse> buscar(String correoUsuario, String nombre, Integer matricula, String grupo) {
        Usuario usuario = obtenerUsuario(correoUsuario);
        if (matricula != null) {
            Estudiante estudiante = obtenerEstudiante(matricula);
            if (!puedeVerEstudiante(usuario, estudiante)) {
                return List.of();
            }
            return List.of(EstudianteResponse.fromEntity(estudiante));
        }

        List<Estudiante> estudiantes = estudiantesVisibles(usuario);
        if (nombre != null && !nombre.isBlank()) {
            String filtro = nombre.toLowerCase();
            estudiantes = estudiantes.stream()
                    .filter(estudiante -> contiene(estudiante.getNombre(), filtro) || contiene(estudiante.getApellidos(), filtro))
                    .toList();
        } else if (grupo != null && !grupo.isBlank()) {
            estudiantes = estudiantes.stream()
                    .filter(estudiante -> estudiante.getGrupo() != null && estudiante.getGrupo().equalsIgnoreCase(grupo))
                    .toList();
        }

        return estudiantes.stream().map(EstudianteResponse::fromEntity).toList();
    }

    public EstudianteResponse obtener(String correoUsuario, Integer matricula) {
        Usuario usuario = obtenerUsuario(correoUsuario);
        Estudiante estudiante = obtenerEstudiante(matricula);
        if (!puedeVerEstudiante(usuario, estudiante)) {
            throw new ResourceNotFoundException("Estudiante no encontrado");
        }
        return EstudianteResponse.fromEntity(estudiante);
    }

    public EstudianteResponse crear(EstudianteRequest request, String usuarioAccion) {
        Estudiante estudiante = new Estudiante();
        aplicarDatos(estudiante, request);
        Estudiante guardado = estudianteRepository.save(estudiante);
        auditoriaService.registrar(usuarioAccion, "CREO_ESTUDIANTE", "Matricula: " + guardado.getMatricula());
        return EstudianteResponse.fromEntity(guardado);
    }

    public EstudianteResponse actualizar(Integer matricula, EstudianteRequest request, String usuarioAccion) {
        Estudiante estudiante = obtenerEstudiante(matricula);
        aplicarDatos(estudiante, request);
        Estudiante guardado = estudianteRepository.save(estudiante);
        auditoriaService.registrar(usuarioAccion, "ACTUALIZO_ESTUDIANTE", "Matricula: " + matricula);
        return EstudianteResponse.fromEntity(guardado);
    }

    public void eliminar(Integer matricula, String usuarioAccion) {
        Estudiante estudiante = obtenerEstudiante(matricula);
        estudianteRepository.delete(estudiante);
        auditoriaService.registrar(usuarioAccion, "ELIMINO_ESTUDIANTE", "Matricula: " + matricula);
    }

    public EstudianteResponse vincularTutor(Integer matricula, Integer idTutor, String usuarioAccion) {
        Estudiante estudiante = obtenerEstudiante(matricula);
        Usuario tutor = usuarioRepository.findById(idTutor)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado"));

        if (!"TUTOR".equals(RoleUtils.normalizeRole(tutor.getTipoUsuario()))) {
            throw new BadRequestException("El usuario indicado no tiene rol TUTOR");
        }

        asegurarRegistroTutor(tutor);

        if (estudiante.getTutores() == null) {
            estudiante.setTutores(new ArrayList<>());
        }

        boolean yaVinculado = estudiante.getTutores().stream()
                .anyMatch(actual -> actual.getIdUsuario().equals(idTutor));
        if (!yaVinculado) {
            estudiante.getTutores().add(tutor);
        }

        Estudiante guardado = estudianteRepository.save(estudiante);
        auditoriaService.registrar(usuarioAccion, "VINCULO_TUTOR", "Matricula: " + matricula + ", tutor: " + idTutor);
        return EstudianteResponse.fromEntity(guardado);
    }

    public EstudianteResponse vincularDocente(Integer matricula, Integer idDocente, String usuarioAccion) {
        Estudiante estudiante = obtenerEstudiante(matricula);
        Usuario docente = usuarioRepository.findById(idDocente)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));

        if (!"DOCENTE".equals(RoleUtils.normalizeRole(docente.getTipoUsuario()))) {
            throw new BadRequestException("El usuario indicado no tiene rol DOCENTE");
        }

        if (estudiante.getDocentes() == null) {
            estudiante.setDocentes(new ArrayList<>());
        }

        boolean yaVinculado = estudiante.getDocentes().stream()
                .anyMatch(actual -> actual.getIdUsuario().equals(idDocente));
        if (!yaVinculado) {
            estudiante.getDocentes().add(docente);
        }

        Estudiante guardado = estudianteRepository.save(estudiante);
        auditoriaService.registrar(usuarioAccion, "VINCULO_DOCENTE", "Matricula: " + matricula + ", docente: " + idDocente);
        return EstudianteResponse.fromEntity(guardado);
    }

    public EstudianteResponse desvincularTutor(Integer matricula, Integer idTutor, String usuarioAccion) {
        Estudiante estudiante = obtenerEstudiante(matricula);

        if (estudiante.getTutores() != null) {
            estudiante.getTutores().removeIf(tutor -> tutor.getIdUsuario().equals(idTutor));
        }

        Estudiante guardado = estudianteRepository.save(estudiante);
        auditoriaService.registrar(usuarioAccion, "DESVINCULO_TUTOR", "Matricula: " + matricula + ", tutor: " + idTutor);
        return EstudianteResponse.fromEntity(guardado);
    }

    public EstudianteResponse desvincularDocente(Integer matricula, Integer idDocente, String usuarioAccion) {
        Estudiante estudiante = obtenerEstudiante(matricula);

        if (estudiante.getDocentes() != null) {
            estudiante.getDocentes().removeIf(docente -> docente.getIdUsuario().equals(idDocente));
        }

        Estudiante guardado = estudianteRepository.save(estudiante);
        auditoriaService.registrar(usuarioAccion, "DESVINCULO_DOCENTE", "Matricula: " + matricula + ", docente: " + idDocente);
        return EstudianteResponse.fromEntity(guardado);
    }

    public List<UsuarioResponse> listarTutores(Integer matricula) {
        Estudiante estudiante = obtenerEstudiante(matricula);
        if (estudiante.getTutores() == null) {
            return List.of();
        }
        return estudiante.getTutores().stream().map(UsuarioResponse::fromEntity).toList();
    }

    public List<UsuarioResponse> listarDocentes(Integer matricula) {
        Estudiante estudiante = obtenerEstudiante(matricula);
        if (estudiante.getDocentes() == null) {
            return List.of();
        }
        return estudiante.getDocentes().stream().map(UsuarioResponse::fromEntity).toList();
    }

    private Estudiante obtenerEstudiante(Integer matricula) {
        return estudianteRepository.findById(matricula)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
    }

    private Usuario obtenerUsuario(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private List<Estudiante> estudiantesVisibles(Usuario usuario) {
        String rol = RoleUtils.normalizeRole(usuario.getTipoUsuario());
        List<Estudiante> estudiantes = estudianteRepository.findAll();
        return switch (rol) {
            case "ADMIN", "DIRECTOR", "ENFERMERA" -> estudiantes;
            case "DOCENTE" -> estudiantes.stream()
                    .filter(estudiante -> estaRelacionado(estudiante.getDocentes(), usuario.getIdUsuario()))
                    .toList();
            case "TUTOR" -> estudiantes.stream()
                    .filter(estudiante -> estaRelacionado(estudiante.getTutores(), usuario.getIdUsuario()))
                    .toList();
            default -> List.of();
        };
    }

    private boolean puedeVerEstudiante(Usuario usuario, Estudiante estudiante) {
        return estudiantesVisibles(usuario).stream()
                .anyMatch(visible -> visible.getMatricula().equals(estudiante.getMatricula()));
    }

    private boolean estaRelacionado(List<Usuario> usuarios, Integer idUsuario) {
        return usuarios != null && usuarios.stream().anyMatch(usuario -> usuario.getIdUsuario().equals(idUsuario));
    }

    private boolean contiene(String valor, String filtro) {
        return valor != null && valor.toLowerCase().contains(filtro);
    }

    private void aplicarDatos(Estudiante estudiante, EstudianteRequest request) {
        estudiante.setNombre(request.getNombre());
        estudiante.setApellidos(request.getApellidos());
        estudiante.setGrado(request.getGrado());
        estudiante.setGrupo(request.getGrupo());
        estudiante.setAlergias(request.getAlergias());
        estudiante.setCondicionesCronicas(request.getCondicionesCronicas());
        estudiante.setFechaNacimiento(request.getFechaNacimiento());
        estudiante.setMedicamentosActuales(request.getMedicamentosActuales());
    }

    private void asegurarRegistroTutor(Usuario usuario) {
        if (tutorRepository.existsById(usuario.getIdUsuario())) {
            return;
        }

        Tutor tutor = new Tutor();
        tutor.setUsuario(usuario);
        tutorRepository.save(tutor);
    }
}
