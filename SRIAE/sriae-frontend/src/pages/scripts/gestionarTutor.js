import { apiGet, apiPost } from '../../services/apiClient.js';
import { alertError } from '../../utils/dom.js';

let students = [];
let tutors = [];
let selectedStudent = null;

const studentSelect = document.getElementById('studentSelect');
const tutorSelect = document.getElementById('tutorSelect');
const tutoresList = document.getElementById('tutoresList');
const studentName = document.querySelector('.student-name');
const studentId = document.querySelector('.student-id');

function studentLabel(student) {
  return `${student.nombre || ''} ${student.apellidos || ''} - ${student.matricula}`.trim();
}

function userLabel(user) {
  const name = `${user.nombreCompleto || ''} ${user.apellidoCompleto || ''}`.trim();
  return `${name || user.correo} - ${user.correo || ''}`;
}

function renderStudents() {
  if (!studentSelect) return;
  studentSelect.innerHTML = '<option value="">Selecciona estudiante</option>' + students
    .map((student) => `<option value="${student.matricula}">${studentLabel(student)}</option>`)
    .join('');
}

function renderAvailableTutors() {
  if (!tutorSelect) return;
  tutorSelect.innerHTML = '<option value="">Selecciona tutor</option>' + tutors
    .map((tutor) => `<option value="${tutor.idUsuario}">${userLabel(tutor)}</option>`)
    .join('');
}

function renderStudentHeader(student) {
  selectedStudent = student || null;
  if (studentName) studentName.textContent = student ? `${student.nombre || ''} ${student.apellidos || ''}` : 'Selecciona un estudiante';
  if (studentId) studentId.textContent = student ? `Matricula: ${student.matricula || ''}` : 'La informacion se carga desde el backend';
}

function renderLinkedTutors(linkedTutors) {
  if (!tutoresList) return;
  tutoresList.innerHTML = linkedTutors.length ? linkedTutors.map((tutor) => `
    <div class="contact-card">
      <div class="contact-info">
        <h4>${tutor.nombreCompleto || ''} ${tutor.apellidoCompleto || ''}</h4>
        <p><i class="fas fa-users"></i> Tutor | <i class="fas fa-phone"></i> ${tutor.telefono || 'Sin telefono'} | ${tutor.correo || ''}</p>
      </div>
    </div>
  `).join('') : '<p>No hay tutores vinculados a este estudiante.</p>';
}

async function loadLinkedTutors(matricula) {
  if (!matricula) {
    renderLinkedTutors([]);
    return;
  }

  const linkedTutors = await apiGet(`/estudiantes/${matricula}/tutores`);
  renderLinkedTutors(linkedTutors);
}

async function selectStudent(matricula) {
  const student = students.find((item) => String(item.matricula) === String(matricula));
  renderStudentHeader(student);
  await loadLinkedTutors(matricula);
}

async function loadInitialData() {
  [students, tutors] = await Promise.all([
    apiGet('/estudiantes'),
    apiGet('/usuarios?rol=TUTOR')
  ]);

  renderStudents();
  renderAvailableTutors();

  const stored = JSON.parse(localStorage.getItem('sriae_estudiante_actual') || 'null');
  const storedMatricula = stored?.matricula;
  const hasStoredStudent = storedMatricula && students.some((student) => String(student.matricula) === String(storedMatricula));

  if (hasStoredStudent) {
    studentSelect.value = String(storedMatricula);
    await selectStudent(storedMatricula);
  } else {
    renderStudentHeader(null);
    renderLinkedTutors([]);
  }
}

studentSelect?.addEventListener('change', () => selectStudent(studentSelect.value).catch(alertError));

document.getElementById('linkTutorBtn')?.addEventListener('click', async () => {
  const matricula = studentSelect?.value;
  const idTutor = tutorSelect?.value;

  if (!matricula || !idTutor) {
    alert('Selecciona estudiante y tutor.');
    return;
  }

  try {
    await apiPost(`/estudiantes/${matricula}/tutores/${idTutor}`, {});
    alert('Tutor vinculado correctamente.');
    await loadLinkedTutors(matricula);
  } catch (error) {
    alertError(error);
  }
});

loadInitialData().catch(alertError);
