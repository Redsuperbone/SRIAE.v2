import { API_BASE_URL } from './config.js';
import { clearSession, getToken } from './session.js';

function buildHeaders(options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
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
    alert('Tu sesion expiro. Inicia sesion nuevamente.');
    window.location.href = 'login.html';
    throw new Error(error?.message || error?.error || 'No autorizado');
  }

  if (response.status === 403) {
    alert('Sin permisos');
    throw new Error('Sin permisos');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    if (response.status === 404 && error?.message === 'Usuario no encontrado' && !path.startsWith('/auth/')) {
      clearSession();
      alert('Tu usuario ya no existe en la base local. Inicia sesion nuevamente.');
      window.location.href = 'login.html';
      throw new Error('Usuario no encontrado');
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

export function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' });
}
