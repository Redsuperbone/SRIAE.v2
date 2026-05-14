import { apiGet, apiPost } from '../../services/apiClient.js';
import { alertError } from '../../utils/dom.js';
import { getRole } from '../../services/session.js';

const tbody = document.getElementById('usersTable');
const form = document.getElementById('userForm');

function value(id) { return document.getElementById(id)?.value.trim(); }

function render(users) {
  if (!tbody) return;
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Sin usuarios registrados</td></tr>';
    return;
  }
  tbody.innerHTML = users.map((u) => `
    <tr><td>${u.idUsuario}</td><td><strong>${u.nombreCompleto || ''} ${u.apellidoCompleto || ''}</strong></td><td>${u.correo || ''}</td><td>${u.telefono || ''}</td><td><span class="badge-soft">${u.tipoUsuario || ''}</span></td></tr>
  `).join('');
}

async function loadUsers() {
  if (getRole() !== 'ADMIN') {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Solo ADMIN puede consultar usuarios.</td></tr>';
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

loadUsers().catch(alertError);
