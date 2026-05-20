import { API_BASE_URL } from '../../services/config.js';
import { apiGet, apiRequest } from '../../services/apiClient.js';
import { getRole, getToken } from '../../services/session.js';
import { renderProtectedImages } from '../../services/media.js';
import { alertError, formatDateTime } from '../../utils/dom.js';

let chartAreasInstance = null;
let chartMensualInstance = null;
const EDIT_ROLES = new Set(['ADMIN', 'DOCENTE', 'ENFERMERA']);
const ESTADOS = ['PENDIENTE', 'EN_PROCESO', 'CERRADA'];

async function cargarReportes() {
  const [estadisticas, incidentes] = await Promise.all([
    apiGet('/estadisticas/incidencias'),
    apiGet('/incidentes')
  ]);

  await renderTabla(incidentes);
  renderGraficas(estadisticas);
}

async function renderTabla(incidentes) {
  const tbody = document.querySelector('.main-table tbody');
  if (!tbody) return;
  tbody.innerHTML = incidentes.map((incidente) => `
    <tr data-incidente-id="${incidente.idIncidente}">
      <td>${formatDateTime(incidente.fechaIncidente)}</td>
      <td>${incidente.nombreEstudiante || ''}</td>
      <td>${incidente.tipo || incidente.titulo || ''}</td>
      <td>${incidente.ubicacion || ''}</td>
      <td><span class="badge-status bg-red"><i class="fas fa-circle"></i> ${incidente.nivelAlerta || ''}</span></td>
      <td>${incidente.fotoRuta ? `<img class="report-photo-thumb" data-protected-src="${incidente.fotoRuta}" alt="Foto del incidente" hidden>` : '<span class="muted-cell">Sin foto</span>'}</td>
      <td>${renderAccionEstado(incidente)}</td>
    </tr>
  `).join('');
  await renderProtectedImages(tbody);
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

function renderGraficas(estadisticas) {
  if (!window.Chart) return;
  const bluePrimary = '#11429f';
  const ctx1 = document.getElementById('chartAreas')?.getContext('2d');
  const ctx2 = document.getElementById('chartMensual')?.getContext('2d');

  if (ctx1) {
    chartAreasInstance?.destroy();
    window.Chart.getChart(ctx1.canvas)?.destroy();
    const labels = Object.keys(estadisticas.porTipo || {});
    const data = Object.values(estadisticas.porTipo || {});
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

cargarReportes().catch(alertError);
