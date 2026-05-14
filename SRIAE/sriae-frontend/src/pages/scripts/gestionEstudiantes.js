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
}

function clearForm() {
  form?.reset();
  setValue('studentMatricula', '');
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
  const docenteSelect = document.getElementById('linkDocente');

  if (studentSelect) {
    const actual = studentSelect.value;
    studentSelect.innerHTML = '<option value="">Selecciona alumno</option>' + students.map(optionEstudiante).join('');
    studentSelect.value = actual;
  }

  if (tutorSelect) {
    tutorSelect.innerHTML = '<option value="">Selecciona tutor</option>' + tutors.map(optionUsuario).join('');
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
  if (matricula) await apiPut(`/estudiantes/${matricula}`, payload());
  else await apiPost('/estudiantes', payload());
  clearForm();
  await loadStudents();
});

document.getElementById('clearStudent')?.addEventListener('click', clearForm);
document.getElementById('searchStudents')?.addEventListener('click', () => loadStudents().catch(alertError));

tbody?.addEventListener('click', async (event) => {
  const edit = event.target.closest('[data-edit]')?.dataset.edit;
  const del = event.target.closest('[data-delete]')?.dataset.delete;
  const profile = event.target.closest('[data-profile]')?.dataset.profile;
  if (edit) {
    const student = students.find((item) => String(item.matricula) === String(edit));
    if (student) fillForm(student);
  }
  if (profile) {
    const student = students.find((item) => String(item.matricula) === String(profile));
    if (student) localStorage.setItem('sriae_estudiante_actual', JSON.stringify(student));
    window.location.href = 'estudiante.html';
  }
  if (del && confirm('¿Eliminar este estudiante?')) {
    await apiDelete(`/estudiantes/${del}`);
    await loadStudents();
  }
});

document.getElementById('linkTutorBtn')?.addEventListener('click', async () => {
  if (!canManage()) return alert('Solo ADMIN puede vincular tutores.');
  const matricula = value('linkMatricula');
  const tutor = value('linkTutor');
  if (!matricula || !tutor) return alert('Selecciona alumno y tutor.');
  await apiPost(`/estudiantes/${matricula}/tutores/${tutor}`, {});
  alert('Tutor vinculado correctamente.');
  await showTutors(matricula);
});

document.getElementById('linkDocenteBtn')?.addEventListener('click', async () => {
  if (!canManage()) return alert('Solo ADMIN puede vincular docentes.');
  const matricula = value('linkMatricula');
  const docente = value('linkDocente');
  if (!matricula || !docente) return alert('Selecciona alumno y docente.');
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
  if (!matricula) return alert('Selecciona un alumno.');
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
  if (!matricula) return alert('Selecciona un alumno.');
  await showDocentes(matricula);
});

Promise.all([loadStudents(), loadAssociationUsers()]).catch(alertError);
