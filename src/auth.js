// src/auth.js
const TOKEN_KEY = "quotes_app_token";
const USER_KEY = "quotes_app_user";

// store token & user info
export function setToken(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser() {
  const t = localStorage.getItem(USER_KEY);
  try {
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken();
}

// wrapper for fetch that injects Authorization header
export async function authFetch(url, opts = {}) {
  const token = getToken();
  const headers = opts.headers ? { ...opts.headers } : {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  const options = { ...opts, headers };
  const res = await fetch(url, options);
  return res;
}
