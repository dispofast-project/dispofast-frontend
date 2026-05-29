import axios, { type AxiosError } from "axios";
import { BASE_URL } from "../utils/constants";
import { useAuthStore } from "../../modules/iam/auth.store";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (!error.response) {
            return Promise.reject(
                new Error("No se pudo conectar al servidor. Verifica tu conexión a internet.")
            );
        }
        return Promise.reject(error);
    }
);

export default apiClient;
