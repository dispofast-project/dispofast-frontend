import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { User } from "../types";

export interface UserServiceParams {
    page?: number;
    size?: number;
}

export const getAllUsers = async (
    params: UserServiceParams
) : Promise<PagedResponse<User>> => {
    const { page = 0, size = 20 } = params;

    try {
        const { data } = await apiClient.get<PagedResponse<User>>("/users", {
            params: {page, size}
        });
        return data;
    } catch (error) {
        throw new Error("Error al cargar los usuarios");
    }
}

const BASE_URL = "/users";

export const searchUsers = async (query: string, params: UserServiceParams): Promise<PagedResponse<User>> => {
    const { page = 0, size = 20 } = params;

    try {
        const { data } = await apiClient.get<PagedResponse<User>>(`${BASE_URL}/search`, {
            params: {
                q: query,
                page,
                size
            }
        });
        return data;
    } catch (error) {
        throw new Error("No se pudieron cargar los usuarios. Por favor, intente de nuevo.");
    }
}