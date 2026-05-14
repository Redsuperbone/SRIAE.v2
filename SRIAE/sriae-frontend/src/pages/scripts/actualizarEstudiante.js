import { apiPost, apiPut } from '../../services/apiClient.js';
import { alertError } from '../../utils/dom.js';

const estudiante = JSON.parse(localStorage.getItem('sriae_estudiante_actual') || 'null');
const form = document.getElementById('formActualizar');

if (estudiante) {
  document.querySelector('.student-name').textContent = `${estudiante.nombre || ''} ${estudiante.apellidos || ''}`;
  document.querySelector('.student-id strong').textContent = estudiante.matricula || '';
}

function leerMedicamentos() {
  return Array.from(document.querySelectorAll('#medicamentosList .med-row')).map((row) => {
    const inputs = row.querySelectorAll('input');
    const frecuencia = row.querySelector('select')?.value || '';
    return [inputs[0]?.value, inputs[1]?.value, frecuencia].filter(Boolean).join(' ');
  }).filter(Boolean).join('; ');
}

function leerAlergias() {
  return Array.from(document.querySelectorAll('#alergiasTags .tag')).map((tag) => tag.textContent.replace('×', '').trim()).filter(Boolean).join(', ');
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!estudiante?.matricula) {
    alert('Selecciona un estudiante antes de actualizar.');
    window.location.href = 'estudiante.html';
    return;
  }

  const textareas = form.querySelectorAll('textarea');
  const inputs = form.querySelectorAll('input');

  try {
    await apiPut(`/estudiantes/${estudiante.matricula}`, {
      nombre: estudiante.nombre,
      apellidos: estudiante.apellidos,
      grado: estudiante.grado,
      grupo: estudiante.grupo,
      fechaNacimiento: estudiante.fechaNacimiento,
      alergias: leerAlergias(),
      condicionesCronicas: textareas[0]?.value || estudiante.condicionesCronicas,
      medicamentosActuales: leerMedicamentos()
    });

    await apiPost('/historial-medico', {
      matriculaEstudiante: estudiante.matricula,
      alergias: leerAlergias(),
      enfermedadesCronicas: textareas[0]?.value || '',
      medicamentos: leerMedicamentos(),
      observaciones: [inputs[inputs.length - 1]?.value, textareas[1]?.value].filter(Boolean).join(' | ')
    });

    alert('Informacion medica actualizada correctamente.');
    window.location.href = 'estudiante.html';
  } catch (error) {
    alertError(error);
  }
});

document.querySelector('.btn-tutor')?.addEventListener('click', () => {
  window.location.href = 'gestionar-tutor.html';
});