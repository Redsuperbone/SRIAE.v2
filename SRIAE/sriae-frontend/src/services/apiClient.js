import { API_BASE_URL } from './config.js';
import { clearSession, getToken } from './session.js';
import { showMessage } from '../utils/dom.js';

function buildHeaders(options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function silentError(message) {
  const error = new Error(message);
  error.silent = true;
  return error;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options)
  }).catch(() => {
    throw new Error('No se pudo conectar con el servidor');
  });

  if (response.status === 401) {
    const error = await response.json().catch(() => null);
    if (path.startsWith('/auth/')) {
      throw new Error(error?.message || error?.error || 'Credenciales incorrectas');
    }

    clearSession();
    showMessage('Tu sesion expiro. Inicia sesion nuevamente.', 'warning');
    window.setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
    throw silentError(error?.message || error?.error || 'No autorizado');
  }

  if (response.status === 403) {
    showMessage('Sin permisos para realizar esta accion.', 'warning');
    throw silentError('Sin permisos');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    if (response.status === 404 && error?.message === 'Usuario no encontrado' && !path.startsWith('/auth/')) {
      clearSession();
      showMessage('Tu usuario ya no existe en la base local. Inicia sesion nuevamente.', 'warning');
      window.setTimeout(() => {
        window.location.href = 'login.html';
      }, 900);
      throw silentError('Usuario no encontrado');
    }

    throw new Error(error?.message || error?.error || 'Ocurrio un error en la solicitud');
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export function apiGet(path) {
  return apiRequest(path);
}

export function apiPost(path, body) {
  return apiRequest(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export function apiPut(path, body) {
  return apiRequest(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export function apiPatch(path, body) {
  return apiRequest(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' });
}
