import { recoverPassword, resetPassword } from '../../services/auth.js';
import { alertError } from '../../utils/dom.js';

const form = document.getElementById('recoverForm');
const resetForm = document.getElementById('resetForm');
const result = document.getElementById('recoverResult');
const hint = document.getElementById('recoverHint');
const token = new URLSearchParams(window.location.search).get('token');

function showResult(message) {
  result.style.display = 'block';
  result.textContent = message;
}

if (token) {
  form.style.display = 'none';
  resetForm.style.display = 'grid';
  hint.textContent = 'Escribe una nueva contrasena para tu cuenta.';
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const correo = document.getElementById('correo').value.trim();

  try {
    await recoverPassword(correo);
    showResult(`Solicitud registrada para ${correo}. Revisa tu correo para restablecer la contrasena.`);
    form.reset();
  } catch (error) {
    alertError(error);
  }
});

resetForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nuevaContrasena = document.getElementById('nuevaContrasena').value;
  const confirmarContrasena = document.getElementById('confirmarContrasena').value;

  if (nuevaContrasena !== confirmarContrasena) {
    showResult('Las contrasenas no coinciden.');
    return;
  }

  try {
    await resetPassword(token, nuevaContrasena);
    showResult('Contrasena actualizada correctamente. Ya puedes iniciar sesion.');
    resetForm.reset();
    resetForm.style.display = 'none';
  } catch (error) {
    alertError(error);
  }
});
