import { login } from '../../services/auth.js';
import { alertError } from '../../utils/dom.js';

const form = document.querySelector('form');
const inputs = form ? form.querySelectorAll('input') : [];

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const correo = inputs[0]?.value.trim();
  const contrasena = inputs[1]?.value;

  try {
    await login(correo, contrasena);
    window.location.href = 'index.html';
  } catch (error) {
    alertError(error);
  }
});