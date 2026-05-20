import { API_BASE_URL } from '../../services/config.js';
import { apiGet, apiPut, apiRequest } from '../../services/apiClient.js';
import { getRole, getToken } from '../../services/session.js';
import { renderProtectedImages } from '../../services/media.js';
import { alertError, formatDateTime } from '../../utils/dom.js';

let chartAreasInstance = null;
let chartMensualInstance = null;
let incidentesActuales = [];
let estudiantes = [];
const EDIT_ROLES = new Set(['ADMIN', 'DOCENTE', 'ENFERMERA']);
const ESTADOS = ['PENDIENTE', 'EN_PROCESO', 'CERRADA'];

const filterStudent = document.getElementById('filterStudent');
const filterType = document.getElementById('filterType');
const filterFrom = document.getElementById('filterFrom');
const filterTo = document.getElementById('filterTo');
const editModal = document.getElementById('incidentEditModal');
const editForm = document.getElementById('incidentEditForm');

async function cargarReportes() {
  const query = filtrosQuery();
  const incidentes = await apiGet(`/incidentes${query}`);

  incidentesActuales = Array.isArray(incidentes) ? incidentes : [];
  actualizarFiltroTipos(incidentesActuales);
  await renderTabla(incidentesActuales);
  renderGraficas(calcularEstadisticas(incidentesActuales));
}

async function inicializarFiltros() {
  try {
    estudiantes = await apiGet('/estudiantes');
  } catch (error) {
    estudiantes = [];
  }
  renderSelectAlumnos(filterStudent, 'Todos los alumnos');
  renderSelectAlumnos(document.getElementById('editStudent'), 'Selecciona alumno');
}

function filtrosQuery() {
  const params = new URLSearchParams();
  if (filterStudent?.value) params.set('matricula', filterStudent.value);
  if (filterType?.value) params.set('tipo', filterType.value);
  if (filterFrom?.value) params.set('desde', filterFrom.value);
  if (filterTo?.value) params.set('hasta', filterTo.value);
  const query = params.toString();
  return query ? `?${query}` : '';
}

function renderSelectAlumnos(select, placeholder) {
  if (!select) return;
  select.innerHTML = `<option value="">${placeholder}</option>` + estudiantes.map((estudiante) => {
    const nombre = `${estudiante.nombre || ''} ${estudiante.apellidos || ''}`.trim();
    return `<option value="${estudiante.matricula}">${nombre} - ${estudiante.matricula}</option>`;
  }).join('');
}

function actualizarFiltroTipos(incidentes) {
  if (!filterType) return;
  const selected = filterType.value;
  const tipos = [...new Set(incidentes
    .map((incidente) => incidente.tipo || incidente.titulo)
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es'));
  filterType.innerHTML = '<option value="">Todos los tipos</option>' + tipos
    .map((tipo) => `<option value="${tipo}" ${tipo === selected ? 'selected' : ''}>${tipo}</option>`)
    .join('');
}

async function renderTabla(incidentes) {
  const tbody = document.querySelector('.main-table tbody');
  if (!tbody) return;
  if (!incidentes.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No hay incidencias con los filtros seleccionados.</td></tr>';
    return;
  }
  tbody.innerHTML = incidentes.map((incidente) => `
    <tr data-incidente-id="${incidente.idIncidente}">
      <td>${formatDateTime(incidente.fechaIncidente)}</td>
      <td>${incidente.nombreEstudiante || ''}</td>
      <td>${incidente.tipo || incidente.titulo || ''}</td>
      <td>${incidente.ubicacion || ''}</td>
      <td><span class="badge-status bg-red"><i class="fas fa-circle"></i> ${incidente.nivelAlerta || ''}</span></td>
      <td>${incidente.fotoRuta ? `<img class="report-photo-thumb" data-protected-src="${incidente.fotoRuta}" alt="Foto del incidente" hidden>` : '<span class="muted-cell">Sin foto</span>'}</td>
      <td>${renderAcciones(incidente)}</td>
    </tr>
  `).join('');
  await renderProtectedImages(tbody);
}

function calcularEstadisticas(incidentes) {
  return {
    porGravedad: contarPor(incidentes, (incidente) => incidente.nivelAlerta || 'Sin gravedad'),
    porMes: contarPor(incidentes, (incidente) => {
      if (!incidente.fechaIncidente) return 'Sin fecha';
      const date = new Date(incidente.fechaIncidente);
      if (Number.isNaN(date.getTime())) return 'Sin fecha';
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    })
  };
}

function contarPor(items, keyFn) {
  return items.reduce((result, item) => {
    const key = keyFn(item);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
}

function renderAcciones(incidente) {
  const estado = renderAccionEstado(incidente);
  if (!EDIT_ROLES.has(getRole())) return estado;
  return `
    <div class="report-actions">
      ${estado}
      <button type="button" class="btn-row-edit" data-edit="${incidente.idIncidente}">
        <i class="fas fa-pen"></i> Editar
      </button>
    </div>
  `;
}

function renderAccionEstado(incidente) {
  const estado = incidente.estado || 'PENDIENTE';
  if (!EDIT_ROLES.has(getRole())) {
    return `<span class="status-pill">${labelEstado(estado)}</span>`;
  }

  const options = ESTADOS.map((item) => (
    `<option value="${item}" ${item === estado ? 'selected' : ''}>${labelEstado(item)}</option>`
  )).join('');

  return `
    <label class="status-control">
      <span>Estado</span>
      <select data-status-select data-current="${estado}">
        ${options}
      </select>
    </label>
  `;
}

function labelEstado(estado) {
  const labels = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En proceso',
    CERRADA: 'Cerrada'
  };
  return labels[estado] || estado;
}

function fechaInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function horaInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toTimeString().slice(0, 5);
}

function fechaHoraPayload(date, time) {
  if (!date) return null;
  return `${date}T${time || '00:00'}:00`;
}

function abrirEditar(id) {
  const incidente = incidentesActuales.find((item) => String(item.idIncidente) === String(id));
  if (!incidente || !editModal) return;

  document.getElementById('editIncidentId').value = incidente.idIncidente;
  document.getElementById('editStudent').value = incidente.matriculaEstudiante || '';
  document.getElementById('editType').value = incidente.tipo || incidente.titulo || '';
  document.getElementById('editSeverity').value = incidente.nivelAlerta || 'MEDIA';
  document.getElementById('editStatus').value = incidente.estado || 'PENDIENTE';
  document.getElementById('editDate').value = fechaInput(incidente.fechaIncidente);
  document.getElementById('editTime').value = horaInput(incidente.fechaIncidente);
  document.getElementById('editLocation').value = incidente.ubicacion || '';
  document.getElementById('editDescription').value = incidente.descripcion || '';
  editModal.hidden = false;
}

function cerrarEditar() {
  if (editModal) editModal.hidden = true;
  editForm?.reset();
}

async function guardarEdicion(event) {
  event.preventDefault();
  const id = document.getElementById('editIncidentId')?.value;
  if (!id) return;

  const tipo = document.getElementById('editType')?.value.trim();
  const fecha = document.getElementById('editDate')?.value;
  const hora = document.getElementById('editTime')?.value;
  const payload = {
    titulo: tipo,
    tipo,
    descripcion: document.getElementById('editDescription')?.value.trim() || 'Sin descripcion',
    ubicacion: document.getElementById('editLocation')?.value.trim() || '',
    nivelAlerta: document.getElementById('editSeverity')?.value || 'MEDIA',
    estado: document.getElementById('editStatus')?.value || 'PENDIENTE',
    matriculaEstudiante: Number(document.getElementById('editStudent')?.value),
    fechaIncidente: fechaHoraPayload(fecha, hora)
  };

  try {
    await apiPut(`/incidentes/${id}`, payload);
    cerrarEditar();
    await cargarReportes();
  } catch (error) {
    alertError(error);
  }
}

function renderGraficas(estadisticas) {
  if (!window.Chart) return;
  const bluePrimary = '#11429f';
  const ctx1 = document.getElementById('chartAreas')?.getContext('2d');
  const ctx2 = document.getElementById('chartMensual')?.getContext('2d');

  if (ctx1) {
    chartAreasInstance?.destroy();
    window.Chart.getChart(ctx1.canvas)?.destroy();
    const labels = Object.keys(estadisticas.porGravedad || {});
    const data = Object.values(estadisticas.porGravedad || {});
    chartAreasInstance = new Chart(ctx1, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: [bluePrimary, '#3b82f6', '#10b981', '#f59e0b'] }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (ctx2) {
    chartMensualInstance?.destroy();
    window.Chart.getChart(ctx2.canvas)?.destroy();
    const labels = Object.keys(estadisticas.porMes || {});
    const data = Object.values(estadisticas.porMes || {});
    chartMensualInstance = new Chart(ctx2, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Incidentes', data, backgroundColor: bluePrimary }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

function descargarCsv() {
  const token = getToken();
  const url = `${API_BASE_URL}/export/incidencias/csv`;
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      if (!response.ok) throw new Error('No se pudo exportar');
      return response.blob();
    })
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'incidencias.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch(alertError);
}

document.querySelector('.btn-export-blue')?.addEventListener('click', descargarCsv);
document.addEventListener('click', (event) => {
  if (event.target.closest('[data-export]')) {
    event.preventDefault();
    descargarCsv();
  }

  const editId = event.target.closest('[data-edit]')?.dataset.edit;
  if (editId) {
    abrirEditar(editId);
  }
});

document.addEventListener('change', async (event) => {
  const select = event.target.closest('[data-status-select]');
  if (!select) return;

  const row = select.closest('[data-incidente-id]');
  const id = row?.dataset.incidenteId;
  const nuevoEstado = select.value;
  const estadoAnterior = select.dataset.current || 'PENDIENTE';
  if (!id || nuevoEstado === estadoAnterior) return;

  select.disabled = true;
  try {
    await apiRequest(`/incidentes/${id}/estado?nuevoEstado=${encodeURIComponent(nuevoEstado)}`, {
      method: 'PATCH'
    });
    select.dataset.current = nuevoEstado;
    await cargarReportes();
  } catch (error) {
    select.value = estadoAnterior;
    alertError(error);
  } finally {
    select.disabled = false;
  }
});

document.getElementById('applyFilters')?.addEventListener('click', () => cargarReportes().catch(alertError));
document.getElementById('clearFilters')?.addEventListener('click', () => {
  if (filterStudent) filterStudent.value = '';
  if (filterType) filterType.value = '';
  if (filterFrom) filterFrom.value = '';
  if (filterTo) filterTo.value = '';
  cargarReportes().catch(alertError);
});
document.getElementById('closeEditModal')?.addEventListener('click', cerrarEditar);
document.getElementById('cancelEdit')?.addEventListener('click', cerrarEditar);
editModal?.addEventListener('click', (event) => {
  if (event.target === editModal) cerrarEditar();
});
editForm?.addEventListener('submit', guardarEdicion);

inicializarFiltros()
  .then(cargarReportes)
  .catch(alertError);
