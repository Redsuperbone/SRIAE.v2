import { getUser } from '../../services/session.js';

const KEY = 'sriae_tickets_soporte';
const form = document.getElementById('supportForm');
const tbody = document.getElementById('supportTable');

function tickets() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
function save(items) { localStorage.setItem(KEY, JSON.stringify(items)); }
function value(id) { return document.getElementById(id)?.value.trim(); }

function render() {
  const items = tickets();
  tbody.innerHTML = items.length ? items.map((t) => `
    <tr><td>${new Date(t.fecha).toLocaleString('es-MX')}</td><td>${t.asunto}</td><td><span class="badge-soft">${t.prioridad}</span></td><td>${t.estado}</td></tr>
  `).join('') : '<tr><td colspan="4" class="empty-state">Sin tickets locales</td></tr>';
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const items = tickets();
  items.unshift({ asunto: value('asunto'), prioridad: value('prioridad'), descripcion: value('descripcion'), estado: 'Abierto', usuario: getUser()?.nombre || 'Usuario', fecha: new Date().toISOString() });
  save(items);
  form.reset();
  render();
});

render();
