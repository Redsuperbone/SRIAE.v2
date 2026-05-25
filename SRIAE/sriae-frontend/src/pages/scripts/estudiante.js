import { apiGet } from '../../services/apiClient.js';
import { alertError, formatDateTime } from '../../utils/dom.js';
import { getRole } from '../../services/session.js';
import { loadProtectedImage, renderProtectedImages } from '../../services/media.js';

let estudiantes = [];
let estudiantesFiltrados = [];
let estudianteActual = null;

const role = getRole();
const searchInput = document.querySelector('.search-bar input');
const selectGrado = document.getElementById('select-grado');
const selectGrupo = document.getElementById('select-grupo');
const selectAlumno = document.getElementById('select-alumno');
const profile = document.querySelector('.student-profile');
const footer = document.querySelector('.action-footer');

function text(value, fallback = '') {
  return value ?? fallback;
}

function nombreCompleto(estudiante) {
  return `${estudiante?.nombre || ''} ${estudiante?.apellidos || ''}`.trim();
}

function limpiarOpciones(select, placeholder) {
  if (!select) return;
  select.innerHTML = `<option value="">${placeholder}</option>`;
}

function llenarSelect(select, placeholder, values) {
  if (!select) return;
  const actual = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>` + values
    .map((value) => `<option value="${value}">${value}</option>`)
    .join('');
  if (values.map(String).includes(String(actual))) {
    select.value = actual;
  }
}

function llenarFiltros() {
  const grados = [...new Set(estudiantes.map((e) => e.grado).filter(Boolean))]
    .sort((a, b) => Number(a) - Number(b));
  const grupos = [...new Set(estudiantes.map((e) => e.grupo).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'es'));

  llenarSelect(selectGrado, 'Todos los grados', grados);
  llenarSelect(selectGrupo, 'Todos los grupos', grupos);
}

function coincideBusqueda(estudiante, query) {
  if (!query) return true;
  const texto = [
    estudiante.matricula,
    estudiante.nombre,
    estudiante.apellidos,
    estudiante.grado,
    estudiante.grupo
  ].join(' ').toLowerCase();
  return texto.includes(query.toLowerCase());
}

function filtrarEstudiantes() {
  const query = searchInput?.value.trim() || '';
  const grado = selectGrado?.value || '';
  const grupo = selectGrupo?.value || '';

  estudiantesFiltrados = estudiantes.filter((estudiante) => (
    coincideBusqueda(estudiante, query)
    && (!grado || String(estudiante.grado) === String(grado))
    && (!grupo || String(estudiante.grupo) === String(grupo))
  ));

  llenarAlumnos(estudiantesFiltrados);
}

function llenarAlumnos(data) {
  if (!selectAlumno) return;
  const seleccionActual = selectAlumno.value;

  selectAlumno.innerHTML = '<option value="">Selecciona estudiante</option>' + data.map((estudiante) => (
    `<option value="${estudiante.matricula}">${nombreCompleto(estudiante)} - ${estudiante.matricula}</option>`
  )).join('');

  if (!data.length) {
    limpiarPerfil('No se encontraron estudiantes con esos filtros.');
    return;
  }

  const mantieneSeleccion = data.some((estudiante) => String(estudiante.matricula) === String(seleccionActual));
  if (mantieneSeleccion) {
    selectAlumno.value = String(seleccionActual);
    return;
  }

  limpiarPerfil('Selecciona un estudiante para consultar su informacion.');
}

async function cargarEstudiantes() {
  estudiantes = await apiGet('/estudiantes');
  estudiantesFiltrados = [...estudiantes];
  llenarFiltros();
  llenarAlumnos(estudiantesFiltrados);
  await seleccionarEstudianteDesdeNavegacion();

  if (!estudiantes.length) {
    limpiarPerfil('No hay estudiantes disponibles para tu usuario.');
  }
}

async function seleccionarEstudianteDesdeNavegacion() {
  const stored = JSON.parse(sessionStorage.getItem('sriae_estudiante_perfil') || 'null');
  sessionStorage.removeItem('sriae_estudiante_perfil');
  if (!stored?.matricula) return;

  const existe = estudiantes.some((estudiante) => String(estudiante.matricula) === String(stored.matricula));
  if (!existe) return;

  await seleccionarEstudiante(stored.matricula);
}

async function seleccionarEstudiante(matricula) {
  if (!matricula) {
    limpiarPerfil('Selecciona un estudiante para consultar su informacion.');
    return;
  }

  estudianteActual = await apiGet(`/estudiantes/${matricula}`);
  if (selectAlumno) selectAlumno.value = String(matricula);
  pintarPerfil(estudianteActual);
  await cargarIncidentes(matricula);
}

function pintarPerfil(estudiante) {
  if (profile) profile.style.display = '';
  if (footer) footer.style.display = role === 'ADMIN' ? '' : 'none';

  const textData = document.querySelector('.student-profile .data-group:first-child .text-data');
  if (textData) {
    textData.innerHTML = `
      <p><strong>Nombre:</strong> ${nombreCompleto(estudiante)}</p>
      <p><strong>Matricula:</strong> ${text(estudiante.matricula)}</p>
      <p><strong>Grado:</strong> ${text(estudiante.grado)}</p>
      <p><strong>Grupo:</strong> ${text(estudiante.grupo)}</p>
      <p><strong>Fecha de nacimiento:</strong> ${text(estudiante.fechaNacimiento, 'Sin registrar')}</p>
      <p><strong>Alergias:</strong> ${text(estudiante.alergias, 'Sin registrar')}</p>
      <p><strong>Condiciones cronicas:</strong> ${text(estudiante.condicionesCronicas, 'Ninguna')}</p>
      <p><strong>Medicamentos actuales:</strong> ${text(estudiante.medicamentosActuales, 'Ninguno')}</p>
    `;
  }

  const allergy = document.querySelector('.badge-pill.allergy');
  if (allergy) allergy.textContent = estudiante.alergias || 'Sin alergias';

  const blood = document.querySelector('.badge-pill.blood');
  if (blood) blood.textContent = 'N/D';

  const tutorGrid = document.querySelector('.tutor-grid');
  if (tutorGrid) {
    const tutores = estudiante.tutores || [];
    tutorGrid.innerHTML = tutores.length ? tutores.map((tutor) => `
      <div class="contact-item">
        <p><strong>Nombre:</strong> ${tutor.nombreCompleto || ''} ${tutor.apellidoCompleto || ''}</p>
        <p><strong>Parentesco:</strong> Tutor</p>
        <p><strong>Telefono:</strong> ${tutor.telefono || 'Sin registrar'}</p>
        <p><strong>Correo:</strong> ${tutor.correo || ''}</p>
      </div>
    `).join('') : '<p><strong>Tutor:</strong> Sin tutor vinculado</p>';
  }

  renderStudentPhoto(estudiante.fotoRuta).catch(() => {});
}

async function renderStudentPhoto(fotoRuta) {
  const photoBox = document.querySelector('.photo-box');
  if (!photoBox) return;

  const placeholder = photoBox.querySelector('.placeholder-img');
  let image = photoBox.querySelector('.student-photo-img');
  if (!image) {
    image = document.createElement('img');
    image.className = 'student-photo-img';
    image.alt = 'Foto del estudiante';
    photoBox.prepend(image);
  }

  const url = await loadProtectedImage(fotoRuta);
  if (url) {
    image.src = url;
    image.hidden = false;
    if (placeholder) placeholder.style.display = 'none';
  } else {
    image.hidden = true;
    if (placeholder) placeholder.style.display = '';
  }
}

function limpiarPerfil(mensaje) {
  estudianteActual = null;
  if (profile) profile.style.display = '';
  if (footer) footer.style.display = 'none';

  const textData = document.querySelector('.student-profile .data-group:first-child .text-data');
  const tutorGrid = document.querySelector('.tutor-grid');
  const timeline = document.querySelector('.timeline');

  if (textData) textData.innerHTML = `<p>${mensaje}</p>`;
  if (tutorGrid) tutorGrid.innerHTML = '<p>Sin tutor para mostrar.</p>';
  if (timeline) timeline.innerHTML = '<p>Sin incidentes para mostrar.</p>';
  renderStudentPhoto(null).catch(() => {});
}

async function cargarIncidentes(matricula) {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  try {
    const incidentes = await apiGet(`/incidentes?matricula=${matricula}`);
    timeline.innerHTML = incidentes.length ? incidentes.map((incidente) => `
      <div class="timeline-item ${incidente.estado === 'CERRADA' ? 'resolved' : 'alert'}">
        <div class="t-icon"><i class="fas ${incidente.estado === 'CERRADA' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i></div>
        <div class="t-info">
          <span class="t-date">${formatDateTime(incidente.fechaIncidente)}</span>
          <p class="t-desc"><strong>${incidente.titulo || incidente.tipo || 'Incidente'}:</strong> ${incidente.descripcion || ''}</p>
          ${incidente.fotoRuta ? `<button class="incident-photo-link" data-photo="${incidente.fotoRuta}" type="button"><i class="far fa-image"></i> Ver foto</button><img class="incident-photo" data-protected-src="${incidente.fotoRuta}" alt="Foto del incidente" hidden>` : ''}
        </div>
      </div>
    `).join('') : '<p>No hay incidentes registrados para este estudiante.</p>';
    await renderProtectedImages(timeline);
  } catch (error) {
    timeline.innerHTML = '<p>No se pudo cargar el historial de incidentes.</p>';
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-photo]');
  if (!button) return;
  const image = button.parentElement?.querySelector(`img[data-protected-src="${button.dataset.photo}"]`);
  if (image) image.classList.toggle('show');
});

searchInput?.addEventListener('input', filtrarEstudiantes);
selectGrado?.addEventListener('change', filtrarEstudiantes);
selectGrupo?.addEventListener('change', filtrarEstudiantes);
selectAlumno?.addEventListener('change', () => seleccionarEstudiante(selectAlumno.value).catch(alertError));
document.getElementById('editStudentFromProfile')?.addEventListener('click', () => {
  if (!estudianteActual?.matricula) {
    alertError(new Error('Selecciona un estudiante para actualizar su informacion.'));
    return;
  }

  localStorage.setItem('sriae_estudiante_actual', JSON.stringify(estudianteActual));
  window.location.href = `gestion-estudiantes.html?matricula=${encodeURIComponent(estudianteActual.matricula)}&editar=1`;
});

cargarEstudiantes().catch(alertError);
