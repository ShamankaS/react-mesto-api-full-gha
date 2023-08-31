export const BASE_URL = 'https://api.shamanka.students.nomoredomainsicu.ru';

const handleResponse = async (data) => {
  const res = await data.json();
  if (data.ok) {
    return res
  } else {
    return Promise.reject(res);
  }
}

export async function register(password, email) {
  const data = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ password, email })
  });
  return handleResponse(data);
}

export async function login(password, email) {
  const data = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password, email }),
    credentials: 'include'
  });
  return handleResponse(data);
}

export async function checkToken(token) {
  const data = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    },
    credentials: 'include'
  });
  return handleResponse(data);
}