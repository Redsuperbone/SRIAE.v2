import { API_BASE_URL } from '../../services/config.js';
import { getToken } from '../../services/session.js';
import { apiGet, apiPost } from '../../services/apiClient.js';
import { alertError } from '../../utils/dom.js';

let estudiantes = [];

const searchInput = document.getElementById('buscar-estudiante');
const selectGrado = document.getElementById('select-grado');
const selectGrupo = document.getElementById('select-grupo');
const selectAlumno = document.getElementById('select-alumno');
const fileInput = document.getElementById('foto-incidente');
const uploadArea = document.querySelector('.upload-area');
const uploadText = document.querySelector('.upload-area p');
const medicalPreview = document.getElementById('medicalPreview');
const medicalPreviewStatus = document.getElementById('medicalPreviewStatus');
const medicalPreviewGrid = document.getElementById('medicalPreviewGrid');
const medicalBloodType = document.getElementById('medicalBloodType');
const studentSearchStatus = document.getElementById('studentSearchStatus');

function gravedadBackend(value) {
  return ({ alta: 'GRAVE', media: 'MEDIA', baja: 'BAJA', preventiva: 'PREVENTIVA' }[value] || value || 'MEDIA').toUpperCase();
}

function nombreEstudiante(estudiante) {
  return `${estudiante.nombre || ''} ${estudiante.apellidos || ''}`.trim();
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function optionValues(values) {
  return values.map((value) => `<option value="${value}">${value}</option>`).join('');
}

function cargarFiltros() {
  const grados = [...new Set(estudiantes.map((e) => e.grado).filter(Boolean))]
    .sort((a, b) => Number(a) - Number(b));
  const grupos = [...new Set(estudiantes.map((e) => e.grupo).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'es'));

  if (selectGrado) selectGrado.innerHTML = '<option value="">Grado</option>' + optionValues(grados);
  if (selectGrupo) selectGrupo.innerHTML = '<option value="">Grupo</option>' + optionValues(grupos);
}

function coincideBusqueda(estudiante, query) {
  if (!query) return true;
  const text = [
    estudiante.matricula,
    estudiante.nombre,
    estudiante.apellidos,
    estudiante.grado,
    estudiante.grupo
  ].join(' ');
  return normalizeText(text).includes(normalizeText(query));
}

function estudiantesFiltrados() {
  const query = searchInput?.value.trim() || '';
  const grado = selectGrado?.value || '';
  const grupo = selectGrupo?.value || '';

  return estudiantes.filter((estudiante) => (
    coincideBusqueda(estudiante, query)
    && (!grado || String(estudiante.grado) === String(grado))
    && (!grupo || String(estudiante.grupo) === String(grupo))
  ));
}

function updateSearchStatus(count) {
  if (!studentSearchStatus) return;
  const hasFilters = Boolean(searchInput?.value.trim() || selectGrado?.value || selectGrupo?.value);
  if (!estudiantes.length) {
    studentSearchStatus.textContent = 'No hay alumnos disponibles para tu usuario.';
    return;
  }
  if (!hasFilters) {
    studentSearchStatus.textContent = `${count} alumnos disponibles.`;
    return;
  }
  studentSearchStatus.textContent = count === 1
    ? '1 alumno encontrado.'
    : `${count} alumnos encontrados.`;
}

function actualizarSelectAlumnos(data = estudiantesFiltrados(), options = {}) {
  if (!selectAlumno) return;
  selectAlumno.innerHTML = data.length
    ? '<option value="">Selecciona alumno</option>' + data.map((e) => (
      `<option value="${e.matricula}">${nombreEstudiante(e)} - ${e.matricula}</option>`
    )).join('')
    : '<option value="">Sin alumnos disponibles</option>';
  updateSearchStatus(data.length);
  limpiarHistorialMedico();

  if (options.autoSelectFirst && data.length) {
    selectAlumno.value = String(data[0].matricula);
    cargarHistorialMedico(selectAlumno.value);
  }
}

async function cargarEstudiantesIncidente() {
  estudiantes = await apiGet('/estudiantes');
  cargarFiltros();
  actualizarSelectAlumnos(estudiantes);
}

window.cargarAlumnos = function cargarAlumnos() {
  actualizarSelectAlumnos();
};

window.actualizarAlumnosIncidente = function actualizarAlumnosIncidente() {
  actualizarSelectAlumnos();
};

function textOrFallback(value, fallback = 'Sin registrar') {
  return value && String(value).trim() ? value : fallback;
}

function renderMedicalItems(record) {
  if (!medicalPreviewGrid) return;
  medicalPreviewGrid.innerHTML = [
    ['Alergias', textOrFallback(record?.alergias, 'Sin alergias registradas')],
    ['Enfermedades cronicas', textOrFallback(record?.enfermedadesCronicas, 'Sin enfermedades registradas')],
    ['Medicamentos', textOrFallback(record?.medicamentos, 'Sin medicamentos registrados')],
    ['Observaciones', textOrFallback(record?.observaciones, 'Sin observaciones')]
  ].map(([label, value]) => `
    <div class="medical-item">
      <small>${label}</small>
      <strong>${value}</strong>
    </div>
  `).join('');
}

function limpiarHistorialMedico(message = 'Selecciona un alumno para consultar su informacion medica.') {
  medicalPreview?.classList.remove('medical-alert');
  if (medicalPreviewStatus) medicalPreviewStatus.textContent = message;
  if (medicalBloodType) medicalBloodType.textContent = 'N/D';
  renderMedicalItems(null);
}

async function cargarHistorialMedico(matricula) {
  if (!matricula) {
    limpiarHistorialMedico();
    return;
  }

  if (medicalPreviewStatus) medicalPreviewStatus.textContent = 'Consultando registro medico...';
  if (medicalBloodType) medicalBloodType.textContent = '...';

  try {
    const records = await apiGet(`/historial-medico?matricula=${matricula}`);
    const latest = records[0];

    if (!latest) {
      limpiarHistorialMedico('Este alumno no tiene registros medicos capturados.');
      return;
    }

    const hasImportantInfo = Boolean(
      latest.alergias || latest.enfermedadesCronicas || latest.medicamentos || latest.observaciones
    );
    medicalPreview?.classList.toggle('medical-alert', hasImportantInfo);
    if (medicalPreviewStatus) {
      medicalPreviewStatus.textContent = `Ultima actualizacion: ${latest.fechaRegistro ? new Date(latest.fechaRegistro).toLocaleString('es-MX') : 'sin fecha'}`;
    }
    if (medicalBloodType) medicalBloodType.textContent = latest.tipoSangre || 'N/D';
    renderMedicalItems(latest);
  } catch (error) {
    limpiarHistorialMedico('No fue posible consultar el registro medico para este alumno.');
  }
}

window.limpiarHistorialMedico = limpiarHistorialMedico;

function selectedFile() {
  return fileInput?.files?.[0] || null;
}

function validarFoto(file) {
  if (!file) return;
  const maxBytes = 5 * 1024 * 1024;
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    fileInput.value = '';
    throw new Error('La foto debe ser JPG o PNG.');
  }
  if (file.size > maxBytes) {
    fileInput.value = '';
    throw new Error('La foto no debe superar 5 MB.');
  }
}

function incidentePayload() {
  const tipoSelect = document.getElementById('tipo-incidente');
  const descripcion = document.querySelector('.field-group textarea')?.value.trim();
  const matriculaEstudiante = Number(selectAlumno?.value);

  return {
    titulo: tipoSelect?.selectedOptions[0]?.text || 'Incidente',
    descripcion: descripcion || 'Sin descripcion',
    ubicacion: document.getElementById('lugar-incidente')?.value || '',
    tipo: tipoSelect?.selectedOptions[0]?.text || tipoSelect?.value || 'Incidente',
    nivelAlerta: gravedadBackend(document.getElementById('select-gravedad')?.value),
    matriculaEstudiante
  };
}

async function postMultipart(payload, file) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }
  formData.append('foto', file);

  const response = await fetch(`${API_BASE_URL}/incidentes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  }).catch(() => {
    throw new Error('No se pudo conectar con el servidor');
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || error?.error || 'No se pudo registrar el incidente');
  }

  return response.json();
}

async function registrarIncidente() {
  const payload = incidentePayload();
  const file = selectedFile();

  if (!payload.matriculaEstudiante) {
    throw new Error('Selecciona un alumno.');
  }

  if (file) {
    validarFoto(file);
    return postMultipart(payload, file);
  }

  return apiPost('/incidentes', payload);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function soloDigitos(value) {
  return String(value || '').replace(/\D/g, '');
}

function telefonoWhatsApp(value) {
  const digits = soloDigitos(value);
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

function nombreTutor(tutor) {
  return `${tutor?.nombreCompleto || ''} ${tutor?.apellidoCompleto || ''}`.trim() || 'Tutor';
}

function mensajeTutor(incidente) {
  const fecha = incidente?.fechaIncidente
    ? new Date(incidente.fechaIncidente).toLocaleString('es-MX')
    : new Date().toLocaleString('es-MX');
  const reportadoPor = incidente?.reportadoPor || 'personal escolar autorizado';

  return [
    'Buen dia. Le informamos que se ha registrado un incidente escolar.',
    '',
    `Este aviso se envia como seguimiento del registro realizado por ${reportadoPor} y fue generado automaticamente por el Sistema de Registro de Incidentes y Alertas Escolares (SRIAE).`,
    '',
    `Estudiante: ${incidente?.nombreEstudiante || 'No especificado'}`,
    `Incidente: ${incidente?.titulo || incidente?.tipo || 'Incidente'}`,
    `Nivel de alerta: ${incidente?.nivelAlerta || 'No especificado'}`,
    `Lugar: ${incidente?.ubicacion || 'No especificado'}`,
    `Fecha y hora: ${fecha}`,
    incidente?.descripcion ? `Descripcion: ${incidente.descripcion}` : '',
    '',
    'Le solicitamos mantenerse atento(a) a los medios de contacto registrados.'
  ].filter((line) => line !== null && line !== undefined).join('\n');
}

function accionContacto({ href, icon, label, className, disabled = false }) {
  if (disabled) {
    return `<span class="contact-action contact-disabled ${className}"><i class="${icon}"></i>${label}</span>`;
  }
  return `<a class="contact-action ${className}" href="${href}" target="_blank" rel="noopener"><i class="${icon}"></i>${label}</a>`;
}

function renderTutorContactActions(incidente) {
  const container = document.getElementById('tutorContactActions');
  if (!container) return;

  const tutores = Array.isArray(incidente?.tutores) ? incidente.tutores : [];
  if (!tutores.length) {
    container.innerHTML = `
      <div class="tutor-contact-title">
        <strong>Contactar tutor</strong>
        <span>El incidente se registro, pero este alumno no tiene tutores vinculados.</span>
      </div>
    `;
    return;
  }

  const message = mensajeTutor(incidente);
  const hasPhone = tutores.some((tutor) => soloDigitos(tutor.telefono));
  container.innerHTML = `
    <div class="tutor-contact-title">
      <strong>Contactar tutor</strong>
      <span>${hasPhone
        ? 'El correo se envia automaticamente. Llamada y WhatsApp quedan disponibles para seguimiento inmediato.'
        : 'El correo se envia automaticamente, pero ningun tutor tiene telefono registrado para llamada o WhatsApp.'}</span>
    </div>
    ${tutores.map((tutor) => {
      const phone = soloDigitos(tutor.telefono);
      const whatsPhone = telefonoWhatsApp(tutor.telefono);
      return `
        <div class="tutor-contact-card">
          <div>
            <h3>${escapeHtml(nombreTutor(tutor))}</h3>
            <p>${escapeHtml(tutor.telefono || 'Sin telefono')}</p>
          </div>
          <div class="tutor-contact-buttons">
            ${accionContacto({
              href: `tel:${phone}`,
              icon: 'fas fa-phone',
              label: 'Llamar',
              className: 'contact-call',
              disabled: !phone
            })}
            ${accionContacto({
              href: `https://wa.me/${whatsPhone}?text=${encodeURIComponent(message)}`,
              icon: 'fab fa-whatsapp',
              label: 'WhatsApp',
              className: 'contact-whatsapp',
              disabled: !whatsPhone
            })}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function resetFoto() {
  if (fileInput) fileInput.value = '';
  if (uploadText) uploadText.textContent = 'Arrastra y suelta archivos aqui o haz clic para seleccionar';
}

function configurarFoto() {
  uploadArea?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', () => {
    try {
      const file = selectedFile();
      validarFoto(file);
      if (uploadText) uploadText.textContent = file ? `Archivo seleccionado: ${file.name}` : 'Arrastra y suelta archivos aqui o haz clic para seleccionar';
    } catch (error) {
      alertError(error);
      resetFoto();
    }
  });
}

window.enviarFormulario = async function enviarFormulario() {
  cerrarModal();

  const overlay = document.getElementById('overlay-notificacion');
  const iconoContainer = document.getElementById('icono-notif-container');
  const icono = document.getElementById('notif-icono');
  const titulo = document.getElementById('notif-titulo');
  const mensaje = document.getElementById('notif-mensaje');

  try {
    const incidente = await registrarIncidente();
    iconoContainer.className = 'notif-icon-circle notif-success';
    icono.className = 'fas fa-check';
    titulo.innerText = 'Registro Exitoso';
    mensaje.innerText = 'El incidente ha sido guardado. El correo al tutor se enviara automaticamente si el servicio de correo esta configurado.';
    renderTutorContactActions(incidente);
    vaciarCampos();
    actualizarSelectAlumnos(estudiantes);
    resetFoto();
  } catch (error) {
    iconoContainer.className = 'notif-icon-circle notif-error';
    icono.className = 'fas fa-times';
    titulo.innerText = 'Error al Registrar';
    mensaje.innerText = error.message || 'El incidente no pudo registrarse.';
    renderTutorContactActions(null);
  }

  overlay.style.display = 'flex';
  setTimeout(() => overlay.classList.add('active'), 10);
};

searchInput?.addEventListener('input', () => actualizarSelectAlumnos(estudiantesFiltrados(), { autoSelectFirst: true }));
selectGrado?.addEventListener('change', () => actualizarSelectAlumnos());
selectGrupo?.addEventListener('change', () => actualizarSelectAlumnos());
selectAlumno?.addEventListener('change', () => cargarHistorialMedico(selectAlumno.value));

configurarFoto();
cargarEstudiantesIncidente().catch(alertError);
