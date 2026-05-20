package com.sriae.service;

import com.sriae.dto.IncidenteRequest;
import com.sriae.dto.IncidenteResponse;
import com.sriae.dto.IncidenteUpdateRequest;
import com.sriae.exception.ResourceNotFoundException;
import com.sriae.model.Estudiante;
import com.sriae.model.Incidente;
import com.sriae.model.Usuario;
import com.sriae.repository.EstudianteRepository;
import com.sriae.repository.IncidenteRepository;
import com.sriae.repository.UsuarioRepository;
import com.sriae.util.RoleUtils;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class IncidenteService {

    private final IncidenteRepository incidenteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final UploadFileService uploadFileService;
    private final AuditoriaService auditoriaService;
    private final NotificacionService notificacionService;

    public IncidenteService(
            IncidenteRepository incidenteRepository,
            UsuarioRepository usuarioRepository,
            EstudianteRepository estudianteRepository,
            UploadFileService uploadFileService,
            AuditoriaService auditoriaService,
            NotificacionService notificacionService) {
        this.incidenteRepository = incidenteRepository;
        this.usuarioRepository = usuarioRepository;
        this.estudianteRepository = estudianteRepository;
        this.uploadFileService = uploadFileService;
        this.auditoriaService = auditoriaService;
        this.notificacionService = notificacionService;
    }

    @Transactional(readOnly = true)
    public List<IncidenteResponse> listar(String correoUsuario, Integer matricula, String tipo, LocalDate desde, LocalDate hasta) {
        Usuario usuario = obtenerUsuario(correoUsuario);
        String rol = RoleUtils.normalizeRole(usuario.getTipoUsuario());

        List<Incidente> incidentes = switch (rol) {
            case "ADMIN", "DIRECTOR" -> incidenteRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaIncidente"));
            case "DOCENTE" -> incidenteRepository.findByDocenteId(usuario.getIdUsuario());
            case "ENFERMERA" -> incidenteRepository.findByUsuarioReporta_IdUsuario(usuario.getIdUsuario());
            case "TUTOR" -> incidenteRepository.findByTutorId(usuario.getIdUsuario());
            default -> List.of();
        };

        return incidentes.stream()
                .filter(incidente -> matricula == null
                        || (incidente.getEstudiante() != null && Objects.equals(incidente.getEstudiante().getMatricula(), matricula)))
                .filter(incidente -> tipo == null || tipo.isBlank()
                        || (incidente.getTipo() != null && incidente.getTipo().equalsIgnoreCase(tipo)))
                .filter(incidente -> desde == null
                        || (incidente.getFechaIncidente() != null && !incidente.getFechaIncidente().toLocalDate().isBefore(desde)))
                .filter(incidente -> hasta == null
                        || (incidente.getFechaIncidente() != null && !incidente.getFechaIncidente().toLocalDate().isAfter(hasta)))
                .map(IncidenteResponse::fromEntity)
                .toList();
    }

    @Transactional
    public IncidenteResponse crear(IncidenteRequest request, String correoUsuario, MultipartFile foto) throws IOException {
        Usuario usuario = obtenerUsuario(correoUsuario);
        Estudiante estudiante = obtenerEstudiante(request.getMatriculaEstudiante());
        inicializarRelaciones(estudiante);
        validarPuedeRegistrarParaEstudiante(usuario, estudiante);

        Incidente incidente = new Incidente();
        incidente.setTitulo(request.getTitulo());
        incidente.setDescripcion(request.getDescripcion());
        incidente.setUbicacion(request.getUbicacion());
        incidente.setTipo(request.getTipo());
        incidente.setNivelAlerta(request.getNivelAlerta());
        incidente.setEstado("PENDIENTE");
        incidente.setFechaIncidente(request.getFechaIncidente() != null ? request.getFechaIncidente() : LocalDateTime.now());
        incidente.setUsuarioReporta(usuario);
        incidente.setEstudiante(estudiante);

        guardarFotoSiExiste(incidente, foto);

        Incidente guardado = incidenteRepository.save(incidente);
        auditoriaService.registrar(correoUsuario, "CREO_INCIDENTE", "Incidente: " + guardado.getIdIncidente());
        notificacionService.notificarIncidenteRelevante(guardado);
        return IncidenteResponse.fromEntity(guardado);
    }

    @Transactional
    public IncidenteResponse actualizar(Integer id, IncidenteUpdateRequest request, String correoUsuario) {
        Incidente incidente = obtenerIncidente(id);

        if (request.getTitulo() != null) incidente.setTitulo(request.getTitulo());
        if (request.getDescripcion() != null) incidente.setDescripcion(request.getDescripcion());
        if (request.getUbicacion() != null) incidente.setUbicacion(request.getUbicacion());
        if (request.getTipo() != null) incidente.setTipo(request.getTipo());
        if (request.getNivelAlerta() != null) incidente.setNivelAlerta(request.getNivelAlerta());
        if (request.getEstado() != null) incidente.setEstado(request.getEstado());
        if (request.getMatriculaEstudiante() != null) incidente.setEstudiante(obtenerEstudiante(request.getMatriculaEstudiante()));

        Incidente guardado = incidenteRepository.save(incidente);
        auditoriaService.registrar(correoUsuario, "ACTUALIZO_INCIDENTE", "Incidente: " + id);
        return IncidenteResponse.fromEntity(guardado);
    }

    @Transactional
    public IncidenteResponse actualizarEstado(Integer id, String nuevoEstado, String correoUsuario) {
        Incidente incidente = obtenerIncidente(id);
        incidente.setEstado(nuevoEstado);
        Incidente guardado = incidenteRepository.save(incidente);
        auditoriaService.registrar(correoUsuario, "ACTUALIZO_ESTADO_INCIDENTE", "Incidente: " + id + ", estado: " + nuevoEstado);
        return IncidenteResponse.fromEntity(guardado);
    }

    @Transactional
    public void eliminar(Integer id, String correoUsuario) {
        Incidente incidente = obtenerIncidente(id);

        if (incidente.getFotoRuta() != null) {
            uploadFileService.eliminar(incidente.getFotoRuta());
        }

        incidenteRepository.delete(incidente);
        auditoriaService.registrar(correoUsuario, "ELIMINO_INCIDENTE", "Incidente: " + id);
    }

    private Usuario obtenerUsuario(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private Estudiante obtenerEstudiante(Integer matricula) {
        return estudianteRepository.findById(matricula)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
    }

    private void inicializarRelaciones(Estudiante estudiante) {
        if (estudiante.getTutores() != null) {
            estudiante.getTutores().size();
        }
        if (estudiante.getDocentes() != null) {
            estudiante.getDocentes().size();
        }
    }

    private Incidente obtenerIncidente(Integer id) {
        return incidenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidente no encontrado"));
    }

    private void validarPuedeRegistrarParaEstudiante(Usuario usuario, Estudiante estudiante) {
        String rol = RoleUtils.normalizeRole(usuario.getTipoUsuario());
        if (!"DOCENTE".equals(rol)) {
            return;
        }

        boolean relacionado = estudiante.getDocentes() != null
                && estudiante.getDocentes().stream().anyMatch(docente -> docente.getIdUsuario().equals(usuario.getIdUsuario()));
        if (!relacionado) {
            throw new ResourceNotFoundException("Estudiante no encontrado");
        }
    }

    private void guardarFotoSiExiste(Incidente incidente, MultipartFile foto) throws IOException {
        if (foto != null && !foto.isEmpty()) {
            incidente.setFotoRuta(uploadFileService.copiar(foto));
        }
    }
}
