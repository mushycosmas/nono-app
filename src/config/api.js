// src/config/api.js

const API_URL = "https://nono.co.tz/api";

export const endpoints = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
};

export default API_URL;