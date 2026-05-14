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

export function alertError(error) {
  alert(error?.message || 'Ocurrio un error inesperado');
}

export function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-MX');
}