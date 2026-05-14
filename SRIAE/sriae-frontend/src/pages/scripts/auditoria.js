import { apiGet } from '../../services/apiClient.js';
import { getRole } from '../../services/session.js';
import { alertError, formatDateTime } from '../../utils/dom.js';

const tbody = document.getElementById('auditTable');

function render(items) {
  if (!tbody) return;
  if (getRole() !== 'ADMIN') {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Solo ADMIN puede consultar auditoria.</td></tr>';
    return;
  }
  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Sin registros de auditoria</td></tr>';
    return;
  }
  tbody.innerHTML = items.map((log) => `
    <tr><td>${formatDateTime(log.fecha)}</td><td>${log.usuario || ''}</td><td><span class="badge-soft">${log.accion || ''}</span></td><td>${log.detalle || ''}</td></tr>
  `).join('');
}

async function load() {
  if (getRole() !== 'ADMIN') return render([]);
  render(await apiGet('/auditoria'));
}

load().catch(alertError);
