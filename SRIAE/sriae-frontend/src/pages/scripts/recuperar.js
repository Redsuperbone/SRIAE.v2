const form = document.getElementById('recoverForm');
const result = document.getElementById('recoverResult');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const correo = document.getElementById('correo').value.trim();
  const solicitudes = JSON.parse(localStorage.getItem('sriae_recuperacion') || '[]');
  solicitudes.unshift({ correo, fecha: new Date().toISOString(), estado: 'Solicitado' });
  localStorage.setItem('sriae_recuperacion', JSON.stringify(solicitudes));
  result.style.display = 'block';
  result.textContent = `Solicitud registrada para ${correo}. En una implementacion real aqui se enviaria el correo con token.`;
  form.reset();
});
