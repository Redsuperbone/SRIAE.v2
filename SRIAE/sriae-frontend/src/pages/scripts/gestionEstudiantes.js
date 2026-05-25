import { apiDelete, apiGet, apiPost, apiPut } from '../../services/apiClient.js';
import { alertError } from '../../utils/dom.js';
import { getRole } from '../../services/session.js';

let students = [];
let tutors = [];
let docentes = [];
const role = getRole();
const tbody = document.getElementById('studentsTable');
const form = document.getElementById('studentForm');

function value(id) { return document.getElementById(id)?.value.trim(); }
function setValue(id, val) { const el = document.getElementById(id); if (el) el.value = val ?? ''; }
function canManage() { return role === 'ADMIN'; }
function isEditingStudent() { return Boolean(value('studentMatricula')); }

function applyPermissionVisibility() {
  document.querySelectorAll('[data-admin-only]').forEach((element) => {
    element.style.display = canManage() ? '' : 'none';
  });
}

function payload() {
  return {
    nombre: value('nombre'),
    apellidos: value('apellidos'),
    grado: Number(value('grado')),
    grupo: value('grupo'),
    fechaNacimiento: value('fechaNacimiento') || null,
    alergias: value('alergias'),
    condicionesCronicas: value('condicionesCronicas'),
    medicamentosActuales: value('medicamentosActuales')
  };
}

function fillForm(student) {
  setValue('studentMatricula', student.matricula);
  setValue('nombre', student.nombre);
  setValue('apellidos', student.apellidos);
  setValue('grado', student.grado);
  setValue('grupo', student.grupo);
  setValue('fechaNacimiento', student.fechaNacimiento);
  setValue('alergias', student.alergias);
  setValue('condicionesCronicas', student.condicionesCronicas);
  setValue('medicamentosActuales', student.medicamentosActuales);
  setValue('linkMatricula', student.matricula);
  updateCreateOnlyFields();
}

function selectedStudentFromNavigation() {
  const params = new URLSearchParams(window.location.search);
  const matricula = params.get('matricula');
  if (!matricula) return null;
  return students.find((student) => String(student.matricula) === String(matricula));
}

function loadSelectedStudentForEdit() {
  if (!canManage()) return;
  const selected = selectedStudentFromNavigation();
  if (!selected) return;

  fillForm(selected);
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearForm() {
  form?.reset();
  setValue('studentMatricula', '');
  updateCreateOnlyFields();
}

function optionUsuario(usuario) {
  const nombre = `${usuario.nombreCompleto || ''} ${usuario.apellidoCompleto || ''}`.trim();
  return `<option value="${usuario.idUsuario}">${nombre || usuario.correo} - ${usuario.correo || ''}</option>`;
}

function optionEstudiante(student) {
  return `<option value="${student.matricula}">${student.nombre || ''} ${student.apellidos || ''} - ${student.matricula}</option>`;
}

function renderAssociationSelects() {
  const studentSelect = document.getElementById('linkMatricula');
  const tutorSelect = document.getElementById('linkTutor');
  const initialTutorSelect = document.getElementById('initialTutorExisting');
  const docenteSelect = document.getElementById('linkDocente');

  if (studentSelect) {
    const actual = studentSelect.value;
    studentSelect.innerHTML = '<option value="">Selecciona estudiante</option>' + students.map(optionEstudiante).join('');
    studentSelect.value = actual;
  }

  if (tutorSelect) {
    tutorSelect.innerHTML = '<option value="">Selecciona tutor</option>' + tutors.map(optionUsuario).join('');
  }

  if (initialTutorSelect) {
    initialTutorSelect.innerHTML = '<option value="">Selecciona tutor</option>' + tutors.map(optionUsuario).join('');
  }

  if (docenteSelect) {
    docenteSelect.innerHTML = '<option value="">Selecciona docente</option>' + docentes.map(optionUsuario).join('');
  }
}

function render() {
  if (!tbody) return;
  if (!students.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Sin estudiantes registrados</td></tr>';
    return;
  }
  tbody.innerHTML = students.map((s) => `
    <tr>
      <td>${s.matricula ?? ''}</td>
      <td><strong>${s.nombre ?? ''} ${s.apellidos ?? ''}</strong><br><span class="badge-soft">${s.grado ?? ''}-${s.grupo ?? ''}</span></td>
      <td>${s.grupo ?? ''}</td>
      <td>${s.alergias || 'Sin alergias'}<br>${s.condicionesCronicas || ''}</td>
      <td><div class="inline-actions">
        ${canManage() ? `<button class="btn-admin btn-secondary-admin" data-edit="${s.matricula}"><i class="fas fa-edit"></i> Editar</button>` : ''}
        <button class="btn-admin btn-muted-admin" data-profile="${s.matricula}"><i class="fas fa-eye"></i> Perfil</button>
        ${canManage() ? `<button class="btn-admin btn-danger-admin" data-delete="${s.matricula}"><i class="fas fa-trash"></i> Eliminar</button>` : ''}
      </div></td>
    </tr>
  `).join('');
}

async function loadStudents() {
  const params = new URLSearchParams();
  if (value('filterNombre')) params.set('nombre', value('filterNombre'));
  if (value('filterMatricula')) params.set('matricula', value('filterMatricula'));
  if (value('filterGrupo')) params.set('grupo', value('filterGrupo'));
  const query = params.toString();
  students = await apiGet(`/estudiantes${query ? `?${query}` : ''}`);
  render();
  renderAssociationSelects();
  loadSelectedStudentForEdit();
}

function updateTutorModeFields() {
  const mode = value('initialTutorMode') || 'existing';
  document.querySelectorAll('[data-initial-tutor-existing]').forEach((element) => {
    element.hidden = mode !== 'existing';
  });
  document.querySelectorAll('[data-initial-tutor-new]').forEach((element) => {
    element.hidden = mode !== 'new';
  });
}

function updateCreateOnlyFields() {
  document.querySelectorAll('[data-create-only], [data-initial-tutor-existing], [data-initial-tutor-new]').forEach((element) => {
    element.style.display = isEditingStudent() ? 'none' : '';
  });
  updateTutorModeFields();
}

async function resolveInitialTutorId() {
  if (isEditingStudent()) return null;

  const mode = value('initialTutorMode') || 'existing';
  if (mode === 'existing') {
    const tutorId = value('initialTutorExisting');
    if (!tutorId) throw new Error('Selecciona un tutor para el estudiante.');
    return tutorId;
  }

  const nombreCompleto = value('newTutorName');
  const correoElectronico = value('newTutorEmail');
  const contrasena = value('newTutorPassword');
  if (!nombreCompleto || !correoElectronico || !contrasena) {
    throw new Error('Completa nombre, correo y contrasena temporal del tutor.');
  }

  const tutor = await apiPost('/usuarios', {
    nombreCompleto,
    apellidoCompleto: value('newTutorLastName'),
    correoElectronico,
    telefono: value('newTutorPhone'),
    contrasena,
    tipoUsuario: 'TUTOR'
  });
  tutors = await apiGet('/usuarios?rol=TUTOR');
  renderAssociationSelects();
  return tutor.idUsuario;
}

async function loadAssociationUsers() {
  if (!canManage()) return;
  [tutors, docentes] = await Promise.all([
    apiGet('/usuarios?rol=TUTOR'),
    apiGet('/usuarios?rol=DOCENTE')
  ]);
  renderAssociationSelects();
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!canManage()) return alert('Solo ADMIN puede crear o actualizar estudiantes.');
  const matricula = value('studentMatricula');
  try {
    if (matricula) {
      await apiPut(`/estudiantes/${matricula}`, payload());
    } else {
      const tutorId = await resolveInitialTutorId();
      const created = await apiPost('/estudiantes', payload());
      await apiPost(`/estudiantes/${created.matricula}/tutores/${tutorId}`, {});
    }
    clearForm();
    await loadStudents();
  } catch (error) {
    alertError(error);
  }
});

document.getElementById('clearStudent')?.addEventListener('click', clearForm);
document.getElementById('searchStudents')?.addEventListener('click', () => loadStudents().catch(alertError));
document.getElementById('initialTutorMode')?.addEventListener('change', updateTutorModeFields);

tbody?.addEventListener('click', async (event) => {
  const edit = event.target.closest('[data-edit]')?.dataset.edit;
  const del = event.target.closest('[data-delete]')?.dataset.delete;
  const profile = event.target.closest('[data-profile]')?.dataset.profile;
  if (edit && canManage()) {
    const student = students.find((item) => String(item.matricula) === String(edit));
    if (student) fillForm(student);
  }
  if (profile) {
    const student = students.find((item) => String(item.matricula) === String(profile));
    if (student) sessionStorage.setItem('sriae_estudiante_perfil', JSON.stringify(student));
    window.location.href = 'estudiante.html';
  }
  if (del && canManage() && confirm('¿Eliminar este estudiante?')) {
    await apiDelete(`/estudiantes/${del}`);
    await loadStudents();
  }
});

document.getElementById('linkTutorBtn')?.addEventListener('click', async () => {
  if (!canManage()) return alert('Solo ADMIN puede vincular tutores.');
  const matricula = value('linkMatricula');
  const tutor = value('linkTutor');
  if (!matricula || !tutor) return alert('Selecciona estudiante y tutor.');
  await apiPost(`/estudiantes/${matricula}/tutores/${tutor}`, {});
  alert('Tutor vinculado correctamente.');
  await showTutors(matricula);
});

document.getElementById('linkDocenteBtn')?.addEventListener('click', async () => {
  if (!canManage()) return alert('Solo ADMIN puede vincular docentes.');
  const matricula = value('linkMatricula');
  const docente = value('linkDocente');
  if (!matricula || !docente) return alert('Selecciona estudiante y docente.');
  await apiPost(`/estudiantes/${matricula}/docentes/${docente}`, {});
  alert('Docente vinculado correctamente.');
  await showDocentes(matricula);
});

async function showTutors(matricula) {
  const box = document.getElementById('tutorsResult');
  const tutors = await apiGet(`/estudiantes/${matricula}/tutores`);
  box.style.display = 'block';
  box.innerHTML = tutors.length ? tutors.map((t) => `<strong>${t.nombreCompleto} ${t.apellidoCompleto || ''}</strong> - ${t.correo || ''}`).join('<br>') : 'Sin tutores asociados';
}

document.getElementById('viewTutorsBtn')?.addEventListener('click', async () => {
  if (!canManage()) return alert('Solo ADMIN puede consultar tutores desde esta pantalla.');
  const matricula = value('linkMatricula');
  if (!matricula) return alert('Selecciona un estudiante.');
  await showTutors(matricula);
});

async function showDocentes(matricula) {
  const box = document.getElementById('docentesResult');
  const docentes = await apiGet(`/estudiantes/${matricula}/docentes`);
  box.style.display = 'block';
  box.innerHTML = docentes.length ? docentes.map((d) => `<strong>${d.nombreCompleto} ${d.apellidoCompleto || ''}</strong> - ${d.correo || ''}`).join('<br>') : 'Sin docentes asociados';
}

document.getElementById('viewDocentesBtn')?.addEventListener('click', async () => {
  if (!canManage()) return alert('Solo ADMIN puede consultar docentes desde esta pantalla.');
  const matricula = value('linkMatricula');
  if (!matricula) return alert('Selecciona un estudiante.');
  await showDocentes(matricula);
});

applyPermissionVisibility();
Promise.all([loadStudents(), loadAssociationUsers()]).catch(alertError);
