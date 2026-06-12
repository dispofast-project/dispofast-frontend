import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { CreateUserFormData, PermissionOverride, User, UserPermissionsDetail } from "../types";

export interface UserServiceParams {
    page?: number;
    size?: number;
}

const BASE_URL = "/users";

export const getAllUsers = async (params: UserServiceParams): Promise<PagedResponse<User>> => {
    const { page = 0, size = 20 } = params;
    const { data } = await apiClient.get<PagedResponse<User>>(BASE_URL, {
        params: { page, size }
    });
    return data;
};

export const searchUsers = async (
    query: string,
    params: UserServiceParams
): Promise<PagedResponse<User>> => {
    const { page = 0, size = 20 } = params;
    const { data } = await apiClient.get<PagedResponse<User>>(`${BASE_URL}/search`, {
        params: { q: query, page, size }
    });
    return data;
};

export const createUser = async (payload: CreateUserFormData): Promise<User> => {
    const { data } = await apiClient.post<User>(BASE_URL, payload);
    return data;
};

export const getUserPermissions = async (id: string): Promise<UserPermissionsDetail> => {
    const { data } = await apiClient.get<UserPermissionsDetail>(`${BASE_URL}/${id}/permissions`);
    return data;
};

export const updateUserPermissions = async (
    id: string,
    permissions: PermissionOverride[]
): Promise<UserPermissionsDetail> => {
    const { data } = await apiClient.patch<UserPermissionsDetail>(
        `${BASE_URL}/${id}/permissions`,
        { permissions }
    );
    return data;
};
