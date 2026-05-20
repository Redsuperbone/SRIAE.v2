import { apiGet } from '../../services/apiClient.js';
import { getRole } from '../../services/session.js';

const INCIDENT_ACCESS_ROLES = new Set(['ADMIN', 'DIRECTOR', 'DOCENTE', 'ENFERMERA', 'TUTOR']);
const RESOLVED_STATES = new Set(['CERRADA', 'CERRADO', 'RESUELTA', 'RESUELTO', 'FINALIZADA', 'FINALIZADO']);

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setTrend(id, text) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = `<i class="fas fa-chart-line"></i> ${text}`;
}

function normalizeState(value) {
  return (value || '').trim().toUpperCase();
}

function isResolved(incidente) {
  return RESOLVED_STATES.has(normalizeState(incidente.estado));
}

function isSameDay(value, target) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === target.getFullYear()
    && date.getMonth() === target.getMonth()
    && date.getDate() === target.getDate();
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

function renderStats(incidentes) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayCount = incidentes.filter((incidente) => isSameDay(incidente.fechaIncidente, today)).length;
  const yesterdayCount = incidentes.filter((incidente) => isSameDay(incidente.fechaIncidente, yesterday)).length;
  const activeCount = incidentes.filter((incidente) => !isResolved(incidente)).length;
  const resolvedCount = incidentes.filter(isResolved).length;

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
    const incidentes = await apiGet('/incidentes');
    renderStats(Array.isArray(incidentes) ? incidentes : []);
  } catch (error) {
    setTrend('statsTodayTrend', 'No se pudieron cargar datos');
    setTrend('statsActiveTrend', 'No se pudieron cargar datos');
    setTrend('statsResolvedTrend', 'No se pudieron cargar datos');
  }
}

cargarEstadisticasInicio();
