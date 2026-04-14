const { VITE_APP_BASE_URL } = import.meta.env;

export const BASE_URL = VITE_APP_BASE_URL || 'http://localhost:8080/api/v1';

export { VITE_APP_BASE_URL };