import { apiPost } from './apiClient.js';
import { clearSession, getToken, saveSession } from './session.js';

export async function login(correo, contrasena) {
  const response = await apiPost('/auth/login', { correo, contrasena });
  saveSession(response);
  return response;
}

export async function registerUser(payload) {
  return apiPost('/usuarios/registrar', payload);
}

export function logout() {
  clearSession();
  window.location.href = 'login.html';
}

export function hasToken() {
  return Boolean(getToken());
}