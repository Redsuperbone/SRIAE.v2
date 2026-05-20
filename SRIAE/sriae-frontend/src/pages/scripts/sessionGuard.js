import { apiGet, apiPut } from '../../services/apiClient.js';
import { getRole, getUser, logout, requireAuth } from '../../services/session.js';

requireAuth();

const user = getUser();
const role = getRole();

const ROLE_ACCESS = {
  ADMIN: [
    'index.html',
    'estudiante.html',
    'gestion-estudiantes.html',
    'actualizar-estudiante.html',
    'gestionar-tutor.html',
    'incidente.html',
    'protocolos.html',
    'reportes.html',
    'historial-medico.html',
    'notificaciones.html',
    'usuarios.html',
    'auditoria.html',
    'perfil.html'
  ],
  DIRECTOR: [
    'index.html',
    'estudiante.html',
    'gestion-estudiantes.html',
    'incidente.html',
    'protocolos.html',
    'reportes.html',
    'notificaciones.html',
    'perfil.html'
  ],
  DOCENTE: [
    'index.html',
    'estudiante.html',
    'gestion-estudiantes.html',
    'incidente.html',
    'protocolos.html',
    'reportes.html',
    'notificaciones.html',
    'perfil.html'
  ],
  ENFERMERA: [
    'index.html',
    'estudiante.html',
    'gestion-estudiantes.html',
    'incidente.html',
    'protocolos.html',
    'historial-medico.html',
    'notificaciones.html',
    'perfil.html'
  ],
  TUTOR: [
    'index.html',
    'estudiante.html',
    'protocolos.html',
    'notificaciones.html',
    'perfil.html'
  ],
  ALUMNO: [
    'index.html',
    'protocolos.html',
    'notificaciones.html',
    'perfil.html'
  ]
};

const NAV_ITEMS = [
  { href: 'index.html', icon: 'fas fa-home', label: 'Inicio' },
  { href: 'estudiante.html', icon: 'far fa-user', label: 'Estudiante' },
  { href: 'gestion-estudiantes.html', icon: 'fas fa-user-graduate', label: 'Gestion estudiantes' },
  { href: 'incidente.html', icon: 'fas fa-exclamation-triangle', label: 'Incidente' },
  { href: 'protocolos.html', icon: 'far fa-file-alt', label: 'Protocolos' }
];

const USER_MENU_ITEMS = [
  { href: 'perfil.html', icon: 'far fa-address-card', label: 'Mi perfil' },
  { href: 'gestion-estudiantes.html', icon: 'fas fa-user-graduate', label: 'Gestion estudiantes' },
  { href: 'reportes.html', icon: 'fas fa-chart-bar', label: 'Reportes' },
  { href: 'historial-medico.html', icon: 'fas fa-notes-medical', label: 'Historial medico' },
  { href: 'notificaciones.html', icon: 'far fa-bell', label: 'Notificaciones' },
  { href: 'usuarios.html', icon: 'fas fa-users-cog', label: 'Usuarios' },
  { href: 'auditoria.html', icon: 'fas fa-clipboard-list', label: 'Auditoria' },
];

let notificacionesCache = [];
let markingNotifications = false;

function allowedPages() {
  return ROLE_ACCESS[role] || ROLE_ACCESS.ALUMNO;
}

function currentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function isAllowed(href) {
  return allowedPages().includes(href);
}

function protectPage() {
  const page = currentPage();
  if (!isAllowed(page)) {
    alert('Tu usuario no tiene acceso a esta seccion.');
    window.location.href = 'index.html';
  }
}

function renderTopNav() {
  const nav = document.querySelector('nav ul');
  if (!nav) return;

  nav.innerHTML = NAV_ITEMS
    .filter((item) => isAllowed(item.href))
    .map((item) => {
      const active = currentPage() === item.href ? ' class="activo"' : '';
      return `<li><a${active} href="${item.href}"><i class="${item.icon}"></i> ${item.label}</a></li>`;
    })
    .join('');
}

function removeForbiddenLinks() {
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !isAllowed(href)) {
      link.remove();
    }
  });
}

function renderUserMenu() {
  if (!user?.nombre) return;

  const menuItems = [
    `<a href="#"><i class="far fa-user-circle"></i> ${user.nombre}</a>`,
    ...USER_MENU_ITEMS
      .filter((item) => isAllowed(item.href))
      .map((item) => `<a href="${item.href}"><i class="${item.icon}"></i> ${item.label}</a>`),
    `<a href="#" data-logout><i class="fas fa-sign-out-alt"></i> Cerrar Sesion</a>`
  ].join('');

  document.querySelectorAll('#userDropdown').forEach((dropdown) => {
    dropdown.innerHTML = menuItems;
  });
}

function applyRoleVisibility() {
  protectPage();
  renderTopNav();
  renderUserMenu();
  removeForbiddenLinks();

  if (role !== 'ADMIN') {
    document.querySelectorAll('[data-admin-only], #studentForm, #linkTutorBtn, #viewTutorsBtn').forEach((el) => {
      el.style.display = 'none';
    });
  }

  if (role !== 'ADMIN' && role !== 'ENFERMERA') {
    document.querySelectorAll('#medicalForm, #exportMedical').forEach((el) => {
      el.style.display = 'none';
    });
  }

  if (role === 'ALUMNO') {
    document.querySelectorAll('.btn-save, .btn-submit-full, .btn-confirmar, .btn-remove-med, .btn-add-more, .btn-add-inline').forEach((el) => {
      el.style.display = 'none';
    });
  }
}

function setBadgeCount(count) {
  document.querySelectorAll('.notif-icon .badge').forEach((badge) => {
    if (count > 0) {
      badge.textContent = String(count > 99 ? '99+' : count);
      badge.classList.add('has-count');
    } else {
      badge.textContent = '';
      badge.classList.remove('has-count');
    }
  });
}

function renderNotificaciones(notificaciones) {
  const containers = document.querySelectorAll('.notif-items');
  const noLeidas = notificaciones.filter((item) => !item.leida).length;
  setBadgeCount(noLeidas);

  const markup = notificaciones.length ? notificaciones.slice(0, 8).map((item) => `
    <a href="notificaciones.html" class="notif-item ${item.leida ? '' : 'unread'}">
      <i class="fas ${item.leida ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <div class="notif-text">
        <p><strong>${item.titulo || 'Notificacion'}:</strong> ${item.mensaje || ''}</p>
        <span>${item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleString('es-MX') : ''}</span>
      </div>
    </a>
  `).join('') : '<div class="notif-item"><div class="notif-text"><p>Sin notificaciones</p></div></div>';

  containers.forEach((container) => {
    container.innerHTML = markup;
  });
}

async function markNotificationsAsRead() {
  if (markingNotifications) return;
  const unread = notificacionesCache.filter((item) => !item.leida && item.idNotificacion);
  if (!unread.length) {
    setBadgeCount(0);
    return;
  }

  markingNotifications = true;
  notificacionesCache = notificacionesCache.map((item) => ({ ...item, leida: true }));
  renderNotificaciones(notificacionesCache);

  try {
    await Promise.allSettled(unread.map((item) => apiPut(`/notificaciones/${item.idNotificacion}/leida`, {})));
  } finally {
    markingNotifications = false;
  }
}

document.querySelectorAll('.view-all').forEach((link) => {
  link.setAttribute('href', 'notificaciones.html');
});

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-logout]')) {
    event.preventDefault();
    logout();
  }
});

document.querySelectorAll('#notifBtn').forEach((button) => {
  button.addEventListener('click', () => {
    markNotificationsAsRead();
  });
});

applyRoleVisibility();

async function cargarNotificaciones() {
  const container = document.querySelector('.notif-items');
  if (!container || !user?.idUsuario) return;

  try {
    const notificaciones = await apiGet(`/notificaciones/usuario/${user.idUsuario}`);
    notificacionesCache = Array.isArray(notificaciones) ? notificaciones : [];
    renderNotificaciones(notificacionesCache);
  } catch (error) {
    // Las notificaciones no bloquean la pantalla principal.
  }
}

cargarNotificaciones();
