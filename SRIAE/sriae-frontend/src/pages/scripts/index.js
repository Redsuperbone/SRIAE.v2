import { apiGet } from '../../services/apiClient.js';
import { getRole } from '../../services/session.js';

const INCIDENT_ACCESS_ROLES = new Set(['ADMIN', 'DIRECTOR', 'DOCENTE', 'ENFERMERA', 'TUTOR']);

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setTrend(id, text) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = `<i class="fas fa-chart-line"></i> ${text}`;
}

function formatDelta(today, yesterday) {
  const delta = today - yesterday;
  if (delta === 0) return 'sin cambios respecto a ayer';
  return `${delta > 0 ? '+' : ''}${delta} respecto a ayer`;
}

function renderUnavailable() {
  setText('statsToday', '--');
  setText('statsActive', '--');
  setText('statsResolved', '--');
  setTrend('statsTodayTrend', 'Sin datos para este rol');
  setTrend('statsActiveTrend', 'Sin datos para este rol');
  setTrend('statsResolvedTrend', 'Sin datos para este rol');
}

function renderStats(stats) {
  const todayCount = Number(stats?.incidentesHoy || 0);
  const yesterdayCount = Number(stats?.incidentesAyer || 0);
  const activeCount = Number(stats?.activos || 0);
  const resolvedCount = Number(stats?.resueltos || 0);

  setText('statsToday', todayCount);
  setText('statsActive', activeCount);
  setText('statsResolved', resolvedCount);
  setTrend('statsTodayTrend', formatDelta(todayCount, yesterdayCount));
  setTrend('statsActiveTrend', 'Pendientes en seguimiento');
  setTrend('statsResolvedTrend', 'Incidentes cerrados');
}

async function cargarEstadisticasInicio() {
  if (!INCIDENT_ACCESS_ROLES.has(getRole())) {
    renderUnavailable();
    return;
  }

  try {
    const stats = await apiGet('/estadisticas/inicio');
    renderStats(stats || {});
  } catch (error) {
    setTrend('statsTodayTrend', 'No se pudieron cargar datos');
    setTrend('statsActiveTrend', 'No se pudieron cargar datos');
    setTrend('statsResolvedTrend', 'No se pudieron cargar datos');
  }
}

cargarEstadisticasInicio();
