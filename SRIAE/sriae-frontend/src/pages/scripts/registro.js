import { registerUser } from '../../services/auth.js';
import { alertError, showMessage } from '../../utils/dom.js';

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

  const payload = {
    nombreCompleto: inputs[0]?.value.trim(),
    apellidoCompleto: inputs[1]?.value.trim(),
    correo: inputs[2]?.value.trim(),
    telefono: inputs[3]?.value.trim(),
    contrasena: inputs[4]?.value,
    tipoUsuario: 'TUTOR'
  };

  try {
    await registerUser(payload);
    showMessage('Cuenta creada correctamente. Ahora inicia sesion.', 'success');
    window.setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
  } catch (error) {
    alertError(error);
  }
});
