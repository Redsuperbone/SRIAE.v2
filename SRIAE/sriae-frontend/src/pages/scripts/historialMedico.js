import { API_BASE_URL } from '../../services/config.js';
import { apiDelete, apiGet, apiPost, apiPut } from '../../services/apiClient.js';
import { getToken, getRole } from '../../services/session.js';
import { alertError, formatDateTime } from '../../utils/dom.js';

let records = [];
const form = document.getElementById('medicalForm');
const tbody = document.getElementById('medicalTable');
const role = getRole();

function value(id) { return document.getElementById(id)?.value.trim(); }
function setValue(id, value) { const el = document.getElementById(id); if (el) el.value = value ?? ''; }
function canEdit() { return role === 'ADMIN' || role === 'ENFERMERA'; }

function payload() {
  return {
    matriculaEstudiante: Number(value('matriculaEstudiante')),
    tipoSangre: value('tipoSangre'),
    alergias: value('alergiasMedicas'),
    enfermedadesCronicas: value('enfermedadesCronicas'),
    medicamentos: value('medicamentos'),
    observaciones: value('observaciones')
  };
}

function fillForm(item) {
  setValue('idHistorial', item.idHistorial);
  setValue('matriculaEstudiante', item.matriculaEstudiante);
  setValue('tipoSangre', item.tipoSangre);
  setValue('alergiasMedicas', item.alergias);
  setValue('enfermedadesCronicas', item.enfermedadesCronicas);
  setValue('medicamentos', item.medicamentos);
  setValue('observaciones', item.observaciones);
}

function render() {
  if (!tbody) return;
  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Sin registros medicos</td></tr>';
    return;
  }
  tbody.innerHTML = records.map((r) => `
    <tr>
      <td>${formatDateTime(r.fechaRegistro)}</td>
      <td><strong>${r.nombreEstudiante || ''}</strong><br>${r.matriculaEstudiante || ''}</td>
      <td><span class="badge-soft">${r.tipoSangre || 'N/D'}</span></td>
      <td>${r.alergias || 'Sin alergias'}</td>
      <td><div class="inline-actions">
        ${canEdit() ? `<button class="btn-admin btn-secondary-admin" data-edit="${r.idHistorial}"><i class="fas fa-edit"></i> Editar</button>` : ''}
        ${role === 'ADMIN' ? `<button class="btn-admin btn-danger-admin" data-delete="${r.idHistorial}"><i class="fas fa-trash"></i> Eliminar</button>` : ''}
      </div></td>
    </tr>
  `).join('');
}

async function loadStudents() {
  const select = document.getElementById('matriculaEstudiante');
  const students = await apiGet('/estudiantes');
  select.innerHTML = '<option value="">Selecciona alumno</option>' + students.map((s) => `<option value="${s.matricula}">${s.nombre} ${s.apellidos} - ${s.matricula}</option>`).join('');
}

async function loadRecords() {
  records = await apiGet('/historial-medico');
  render();
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!canEdit()) return alert('Solo ADMIN o ENFERMERA puede guardar historial medico.');
  const id = value('idHistorial');
  if (id) await apiPut(`/historial-medico/${id}`, payload());
  else await apiPost('/historial-medico', payload());
  form.reset();
  setValue('idHistorial', '');
  await loadRecords();
});

document.getElementById('clearMedical')?.addEventListener('click', () => { form?.reset(); setValue('idHistorial', ''); });

tbody?.addEventListener('click', async (event) => {
  const edit = event.target.closest('[data-edit]')?.dataset.edit;
  const del = event.target.closest('[data-delete]')?.dataset.delete;
  if (edit) fillForm(records.find((item) => String(item.idHistorial) === String(edit)));
  if (del && confirm('¿Eliminar este registro medico?')) {
    await apiDelete(`/historial-medico/${del}`);
    await loadRecords();
  }
});

document.getElementById('exportMedical')?.addEventListener('click', async () => {
  const response = await fetch(`${API_BASE_URL}/export/historial-medico/csv`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!response.ok) throw new Error('No se pudo exportar historial medico');
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'historial-medico.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});

Promise.all([loadStudents(), loadRecords()]).catch(alertError);
