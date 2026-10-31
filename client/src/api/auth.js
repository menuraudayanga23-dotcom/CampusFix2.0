const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TOKEN_KEY = "campusfix_token";

const parseResponse = async (response) => {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "The authentication request failed"
    );
  }

  return result;
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password
    })
  });

  const result = await parseResponse(response);

  if (result.token) {
    localStorage.setItem(TOKEN_KEY, result.token);
  }

  return result;
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}`
    },
    credentials: "include"
  });

  return parseResponse(response);
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  localStorage.removeItem(TOKEN_KEY);

  return parseResponse(response);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
