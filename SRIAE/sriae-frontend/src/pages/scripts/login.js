import { login } from '../../services/auth.js';
import { alertError } from '../../utils/dom.js';

const form = document.querySelector('form');
const inputs = form ? form.querySelectorAll('input') : [];

document.querySelectorAll('.toggle-pass').forEach((button) => {
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'Mostrar contrasena');
  button.addEventListener('click', () => {
    const input = button.closest('.input-group')?.querySelector('input[type="password"], input[type="text"]');
    if (!input) return;

    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    button.classList.toggle('fa-eye', visible);
    button.classList.toggle('fa-eye-slash', !visible);
    button.setAttribute('aria-label', visible ? 'Mostrar contrasena' : 'Ocultar contrasena');
  });
});

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
