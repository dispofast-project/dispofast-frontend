import apiClient from "../../../shared/api/apiClient";
import type { PagedResponseDTO } from "../../../shared/types/common";
import type { User } from "../types";

export interface UserServiceParams {
    page?: number;
    size?: number;
}

export const getAllUsers = async (
    params: UserServiceParams
) : Promise<PagedResponseDTO<User>> => {
    const { page = 0, size = 20 } = params;

    try {
        const { data } = await apiClient.get<PagedResponseDTO<User>>("/users", {
            params: {page, size}
        });
        return data;
    } catch (error) {
        throw new Error("Error al cargar los usuarios");
    }
}

const BASE_URL = "/users";