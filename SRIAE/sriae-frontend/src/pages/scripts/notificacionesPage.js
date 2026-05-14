import { apiGet, apiPut } from '../../services/apiClient.js';
import { getRole, getUser } from '../../services/session.js';
import { alertError, formatDateTime } from '../../utils/dom.js';

let items = [];
const tbody = document.getElementById('notificationsTable');

function render() {
  if (!tbody) return;
  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Sin notificaciones</td></tr>';
    return;
  }
  tbody.innerHTML = items.map((n) => `
    <tr>
      <td><span class="badge-soft ${n.leida ? 'badge-success' : 'badge-warning'}">${n.leida ? 'Leida' : 'Pendiente'}</span></td>
      <td><strong>${n.titulo || ''}</strong></td>
      <td>${n.mensaje || ''}</td>
      <td>${n.usuarioDestino || n.idUsuarioDestino || ''}</td>
      <td>${formatDateTime(n.fechaCreacion)}</td>
      <td>${n.leida ? '' : `<button class="btn-admin btn-secondary-admin" data-read="${n.idNotificacion}"><i class="fas fa-check"></i> Marcar leida</button>`}</td>
    </tr>
  `).join('');
}

async function load() {
  items = getRole() === 'ADMIN' ? await apiGet('/notificaciones') : await apiGet(`/notificaciones/usuario/${getUser()?.idUsuario}`);
  render();
}

tbody?.addEventListener('click', async (event) => {
  const id = event.target.closest('[data-read]')?.dataset.read;
  if (!id) return;
  await apiPut(`/notificaciones/${id}/leida`, {});
  await load();
});

load().catch(alertError);
