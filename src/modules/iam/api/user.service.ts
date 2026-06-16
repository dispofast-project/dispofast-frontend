import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type {
    Category,
    CreateUserFormData,
    GoalType,
    PermissionOverride,
    UpdateUserFormData,
    User,
    UserCommissionRate,
    UserGoal,
    UserPermissionsDetail,
} from "../types";

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

export const getUserById = async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`${BASE_URL}/${id}`);
    return data;
};

export const updateUser = async (id: string, payload: UpdateUserFormData): Promise<User> => {
    const { data } = await apiClient.put<User>(`${BASE_URL}/${id}`, payload);
    return data;
};

export const getUserGoals = async (id: string, type: GoalType): Promise<UserGoal[]> => {
    const { data } = await apiClient.get<UserGoal[]>(`${BASE_URL}/${id}/goals`, {
        params: { type },
    });
    return data;
};

export const createUserGoal = async (
    id: string,
    payload: { type: GoalType; month: number; year: number; value: number }
): Promise<UserGoal> => {
    const { data } = await apiClient.post<UserGoal>(`${BASE_URL}/${id}/goals`, payload);
    return data;
};

export const deleteUserGoal = async (id: string, goalId: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}/goals/${goalId}`);
};

export const getCategories = async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
};

export const getUserCommissionRates = async (id: string): Promise<UserCommissionRate[]> => {
    const { data } = await apiClient.get<UserCommissionRate[]>(
        `${BASE_URL}/${id}/commission-rates`
    );
    return data;
};

export const createUserCommissionRate = async (
    id: string,
    payload: { categoryId: string; rate: number }
): Promise<UserCommissionRate> => {
    const { data } = await apiClient.post<UserCommissionRate>(
        `${BASE_URL}/${id}/commission-rates`,
        payload
    );
    return data;
};

export const deleteUserCommissionRate = async (id: string, rateId: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}/commission-rates/${rateId}`);
};
