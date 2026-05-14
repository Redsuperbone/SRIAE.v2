import { apiGet, apiPut } from '../../services/apiClient.js';
import { alertError } from '../../utils/dom.js';
import { clearSession, updateStoredUser } from '../../services/session.js';

const form = document.getElementById('profileForm');
const statusMessage = document.getElementById('profileStatus');
let currentProfile = null;

function value(id) {
  return document.getElementById(id)?.value.trim();
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

function showStatus(message, type = 'ok') {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
}

function fillProfile(profile) {
  currentProfile = profile;
  setText('profileName', `${profile.nombreCompleto || ''} ${profile.apellidoCompleto || ''}`.trim());
  setText('profileRole', profile.tipoUsuario || 'USUARIO');
  setText('profileEmail', profile.correo || '');
  setText('profilePhone', profile.telefono || 'Sin telefono');
  setValue('nombreCompleto', profile.nombreCompleto);
  setValue('apellidoCompleto', profile.apellidoCompleto);
  setValue('correoElectronico', profile.correo);
  setValue('telefono', profile.telefono);
}

async function loadProfile() {
  fillProfile(await apiGet('/usuarios/perfil'));
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  showStatus('Guardando cambios...', 'info');

  try {
    const previousEmail = currentProfile?.correo;
    const updated = await apiPut('/usuarios/perfil', {
      nombreCompleto: value('nombreCompleto'),
      apellidoCompleto: value('apellidoCompleto'),
      correoElectronico: value('correoElectronico'),
      telefono: value('telefono')
    });

    if (previousEmail && previousEmail !== updated.correo) {
      clearSession();
      alert('Tu correo cambio. Inicia sesion nuevamente con el correo actualizado.');
      window.location.href = 'login.html';
      return;
    }

    updateStoredUser(updated);
    fillProfile(updated);
    showStatus('Informacion actualizada correctamente.');
  } catch (error) {
    showStatus('', 'error');
    alertError(error);
  }
});

loadProfile().catch(alertError);
