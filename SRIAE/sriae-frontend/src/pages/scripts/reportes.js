import { API_BASE_URL } from '../../services/config.js';
import { apiGet } from '../../services/apiClient.js';
import { getToken } from '../../services/session.js';
import { renderProtectedImages } from '../../services/media.js';
import { alertError, formatDateTime } from '../../utils/dom.js';

let chartAreasInstance = null;
let chartMensualInstance = null;

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
    <tr>
      <td>${formatDateTime(incidente.fechaIncidente)}</td>
      <td>${incidente.nombreEstudiante || ''}</td>
      <td>${incidente.tipo || incidente.titulo || ''}</td>
      <td>${incidente.ubicacion || ''}</td>
      <td><span class="badge-status bg-red"><i class="fas fa-circle"></i> ${incidente.nivelAlerta || ''}</span></td>
      <td>${incidente.fotoRuta ? `<img class="report-photo-thumb" data-protected-src="${incidente.fotoRuta}" alt="Foto del incidente" hidden>` : '<span class="muted-cell">Sin foto</span>'}</td>
      <td><a href="#" class="action-pdf" data-export><i class="fas fa-download"></i> CSV</a></td>
    </tr>
  `).join('');
  await renderProtectedImages(tbody);
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

cargarReportes().catch(alertError);
