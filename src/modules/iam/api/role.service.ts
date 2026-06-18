import apiClient from "../../../shared/api/apiClient";
import type { Role } from "../types";

const BASE_URL = "/roles";

export const getAllRoles = async (): Promise<Role[]> => {
    const { data } = await apiClient.get<Role[]>(BASE_URL);
    return data;
};
