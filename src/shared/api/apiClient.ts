import axios from "axios";
import { VITE_APP_BASE_URL } from "../utils/constants";

const apiClient = axios.create({
    baseURL: VITE_APP_BASE_URL,
    headers: {
        "Content-Type" : "application/json",
    },
    timeout: 30000,
});

export default apiClient;