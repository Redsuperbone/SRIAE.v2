export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function text(selector, value) {
  const el = $(selector);
  if (el) el.textContent = value ?? '';
}

const MESSAGE_ICONS = {
  success: 'fa-check-circle',
  error: 'fa-exclamation-circle',
  warning: 'fa-exclamation-triangle',
  info: 'fa-info-circle'
};

function ensureMessageContainer() {
  let container = document.getElementById('pageMessageStack');
  if (container) return container;

  container = document.createElement('div');
  container.id = 'pageMessageStack';
  container.className = 'page-message-stack';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-atomic', 'false');
  document.body.appendChild(container);
  return container;
}

export function showMessage(message, type = 'info', options = {}) {
  const textValue = String(message || 'Ocurrio un error inesperado').trim();
  const normalizedType = MESSAGE_ICONS[type] ? type : 'info';
  const duration = options.duration ?? 4500;
  const container = ensureMessageContainer();
  const notification = document.createElement('div');
  const closeButton = document.createElement('button');
  const icon = document.createElement('i');
  const content = document.createElement('div');
  const title = document.createElement('strong');
  const body = document.createElement('p');

  notification.className = `page-message page-message-${normalizedType}`;
  notification.setAttribute('role', normalizedType === 'error' ? 'alert' : 'status');

  icon.className = `fas ${MESSAGE_ICONS[normalizedType]}`;
  icon.setAttribute('aria-hidden', 'true');

  title.textContent = options.title || {
    success: 'Listo',
    error: 'No fue posible continuar',
    warning: 'Atencion',
    info: 'Aviso'
  }[normalizedType];
  body.textContent = textValue;

  content.className = 'page-message-content';
  content.append(title, body);

  closeButton.className = 'page-message-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Cerrar mensaje');
  closeButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';

  const close = () => {
    notification.classList.add('is-hiding');
    window.setTimeout(() => notification.remove(), 180);
  };

  closeButton.addEventListener('click', close);
  notification.append(icon, content, closeButton);
  container.appendChild(notification);

  if (duration > 0) {
    window.setTimeout(close, duration);
  }

  return notification;
}

export function alertError(error) {
  if (error?.silent) return;
  showMessage(error?.message || 'Ocurrio un error inesperado', 'error');
}

if (typeof window !== 'undefined' && !window.__sriaePageAlertInstalled) {
  window.__sriaePageAlertInstalled = true;
  window.alert = (message) => {
    showMessage(message, 'info');
  };
}

export function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-MX');
}
