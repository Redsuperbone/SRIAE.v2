import { registerUser } from '../../services/auth.js';
import { alertError } from '../../utils/dom.js';

const form = document.querySelector('form');
const inputs = form ? form.querySelectorAll('input') : [];

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    nombreCompleto: inputs[0]?.value.trim(),
    apellidoCompleto: inputs[1]?.value.trim(),
    correo: inputs[2]?.value.trim(),
    contrasena: inputs[3]?.value,
    tipoUsuario: 'TUTOR'
  };

  try {
    await registerUser(payload);
    alert('Cuenta creada correctamente. Ahora inicia sesion.');
    window.location.href = 'login.html';
  } catch (error) {
    alertError(error);
  }
});