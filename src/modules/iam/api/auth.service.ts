import apiClient from "../../../shared/api/apiClient";
import type { LoginFormData, LoginResponse } from "../types";

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
}