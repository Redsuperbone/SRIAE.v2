const API_PORT = '8080';
const API_PATH = '/api';
const API_STORAGE_KEY = 'sriae_api_base_url';
const RENDER_BACKEND_URL = 'https://sriae-v2-3.onrender.com';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function withApiPath(baseUrl) {
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith(API_PATH) ? cleanUrl : `${cleanUrl}${API_PATH}`;
}

function getHostForUrl() {
  if (!window.location.hostname) return 'localhost';
  return window.location.hostname.includes(':')
    ? `[${window.location.hostname}]`
    : window.location.hostname;
}

function getDefaultApiBaseUrl() {
  if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') {
    return withApiPath(`http://localhost:${API_PORT}`);
  }

  if (LOCAL_HOSTS.has(window.location.hostname)) {
    return withApiPath(`${window.location.protocol}//${getHostForUrl()}:${API_PORT}`);
  }

  if (window.location.hostname.endsWith('.onrender.com')) {
    return withApiPath(RENDER_BACKEND_URL);
  }

  return `${window.location.origin}${API_PATH}`;
}

function getConfiguredApiBaseUrl() {
  if (window.SRIAE_API_BASE_URL) {
    return withApiPath(window.SRIAE_API_BASE_URL);
  }

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get('apiBase') || params.get('api');

  if (queryValue) {
    const value = withApiPath(queryValue);
    localStorage.setItem(API_STORAGE_KEY, value);
    return value;
  }

  const storedValue = localStorage.getItem(API_STORAGE_KEY);
  return storedValue || getDefaultApiBaseUrl();
}

export const API_BASE_URL = getConfiguredApiBaseUrl();
export const LOGIN_PAGE = 'login.html';
export const HOME_PAGE = 'index.html';
