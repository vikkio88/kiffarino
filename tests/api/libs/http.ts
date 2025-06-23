import { API_URL } from "../config";
export function basicHeaders(additional = {}) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...additional,
  };
}

export function get(api: string, headers = {}) {
  return fetch(`${API_URL}/${api}`, {
    method: "GET",
    headers: { ...basicHeaders(), ...headers },
  });
}

export function put<T>(api: string, body?: T, headers = {}) {
  return fetch(`${API_URL}/${api}`, {
    method: "PUT",
    headers: { ...basicHeaders(), ...headers },
    body: JSON.stringify(body),
  });
}

export function del(api: string, headers = {}) {
  return fetch(`${API_URL}/${api}`, {
    method: "DELETE",
    headers: { ...basicHeaders(), ...headers },
  });
}

export function post<T>(api: string, body?: T, headers = {}) {
  return fetch(`${API_URL}/${api}`, {
    method: "POST",
    headers: { ...basicHeaders(), ...headers },
    body: JSON.stringify(body),
  });
}
