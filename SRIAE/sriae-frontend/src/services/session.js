const TOKEN_KEY = 'sriae_token';
const USER_KEY = 'sriae_user';

function normalizeRole(role) {
  const value = (role || '').toUpperCase();
  const aliases = {
    ADMINISTRADOR: 'ADMIN',
    DIRECTOR: 'DIRECTOR',
    MAESTRO: 'DOCENTE',
    PROFESOR: 'DOCENTE'
  };
  return aliases[value] || value;
}

export function saveSession(loginResponse) {
  const token = loginResponse.token;
  if (!token) throw new Error('El backend no devolvio token');
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({
    idUsuario: loginResponse.idUsuario,
    nombre: loginResponse.nombre,
    tipoUsuario: normalizeRole(loginResponse.tipoUsuario)
  }));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (error) {
    return null;
  }
}

export function getRole() {
  return normalizeRole(getUser()?.tipoUsuario);
}

export function updateStoredUser(profile) {
  const current = getUser() || {};
  localStorage.setItem(USER_KEY, JSON.stringify({
    ...current,
    idUsuario: profile.idUsuario ?? current.idUsuario,
    nombre: profile.nombreCompleto || current.nombre,
    tipoUsuario: normalizeRole(profile.tipoUsuario || current.tipoUsuario)
  }));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

export function logout() {
  clearSession();
  window.location.href = 'login.html';
}
