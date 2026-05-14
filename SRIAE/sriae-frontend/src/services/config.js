const API_PORT = '8080';
const API_PATH = '/api';
const API_STORAGE_KEY = 'sriae_api_base_url';

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
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    return withApiPath(`${window.location.protocol}//${getHostForUrl()}:${API_PORT}`);
  }

  return withApiPath(`http://localhost:${API_PORT}`);
}

function getConfiguredApiBaseUrl() {
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
