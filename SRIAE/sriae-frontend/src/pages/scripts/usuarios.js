import { apiDelete, apiGet, apiPatch, apiPost } from '../../services/apiClient.js';
import { alertError } from '../../utils/dom.js';
import { getRole } from '../../services/session.js';

const tbody = document.getElementById('usersTable');
const form = document.getElementById('userForm');

function value(id) { return document.getElementById(id)?.value.trim(); }

function render(users) {
  if (!tbody) return;
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Sin usuarios registrados</td></tr>';
    return;
  }

  tbody.innerHTML = users.map((u) => {
    const activo = u.activo !== false;
    return `
      <tr>
        <td>${u.idUsuario}</td>
        <td><strong>${u.nombreCompleto || ''} ${u.apellidoCompleto || ''}</strong></td>
        <td>${u.correo || ''}</td>
        <td>${u.telefono || ''}</td>
        <td><span class="badge-soft">${u.tipoUsuario || ''}</span></td>
        <td><span class="badge-soft ${activo ? 'badge-success' : 'badge-warning'}">${activo ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <div class="inline-actions">
            <button class="btn-admin ${activo ? 'btn-muted-admin' : 'btn-secondary-admin'}" type="button" data-toggle-status="${u.idUsuario}" data-active="${activo ? 'false' : 'true'}">
              <i class="fas ${activo ? 'fa-user-slash' : 'fa-user-check'}"></i> ${activo ? 'Desactivar' : 'Activar'}
            </button>
            <button class="btn-admin btn-danger-admin" type="button" data-delete="${u.idUsuario}">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function loadUsers() {
  if (getRole() !== 'ADMIN') {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Solo ADMIN puede consultar usuarios.</td></tr>';
    form?.querySelectorAll('input,select,button').forEach((el) => el.disabled = true);
    return;
  }
  render(await apiGet('/usuarios'));
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    nombreCompleto: value('nombreCompleto'),
    apellidoCompleto: value('apellidoCompleto'),
    correoElectronico: value('correoElectronico'),
    telefono: value('telefono'),
    contrasena: value('contrasena'),
    tipoUsuario: value('tipoUsuario')
  };
  await apiPost('/usuarios', payload);
  form.reset();
  await loadUsers();
});

tbody?.addEventListener('click', async (event) => {
  const statusButton = event.target.closest('[data-toggle-status]');
  const deleteButton = event.target.closest('[data-delete]');

  try {
    if (statusButton) {
      const id = statusButton.dataset.toggleStatus;
      const activo = statusButton.dataset.active === 'true';
      const accion = activo ? 'activar' : 'desactivar';
      if (!confirm(`¿Deseas ${accion} esta cuenta?`)) return;

      await apiPatch(`/usuarios/${id}/estado`, { activo });
      await loadUsers();
    }

    if (deleteButton) {
      const id = deleteButton.dataset.delete;
      if (!confirm('¿Eliminar esta cuenta? La cuenta perdera acceso al sistema.')) return;

      await apiDelete(`/usuarios/${id}`);
      await loadUsers();
    }
  } catch (error) {
    alertError(error);
  }
});

loadUsers().catch(alertError);
