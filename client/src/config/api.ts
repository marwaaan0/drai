const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/api/chat`,
  health: `${API_BASE_URL}/health`,
} as const;

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;
