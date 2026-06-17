export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    tokenType: string;
    expiresIn: number;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        effectivePermissions: string[];
    }
}

export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    role: string;
    effectivePermissions: string[];
}

export interface AuthState {
    isAuthenticated: boolean;
    user: AuthenticatedUser | null;
    token: string | null;
    authorities: string[];
    login: (data: LoginResponse) => void;
    logout: () => void;
    checkAuth: () => void;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    effectivePermissions: string[];
}

export interface PermissionSummary {
    id: string;
    name: string;
    grantedByRole: boolean;
}

export interface Role {
    id: string;
    name: string;
    permissions: PermissionSummary[];
}

export interface PermissionOverride {
    permissionId: string;
    permissionName: string;
    granted: boolean;
}

export interface UserPermissionsDetail {
    userId: string;
    userName: string;
    role: string;
    overrides: PermissionOverride[];
}

export interface CreateUserFormData {
    name: string;
    email: string;
    password: string;
    roleId: string;
}

export interface UpdateUserFormData {
    name: string;
    email: string;
    roleId: string;
}

export type GoalType = "SALES_QUOTA" | "COLLECTION_QUOTA";

export interface UserGoal {
    id: string;
    type: GoalType;
    month: number;
    year: number;
    value: number;
}

export interface Category {
    id: string;
    name: string;
}

export interface UserCommissionRate {
    id: string;
    categoryId: string;
    categoryName: string;
    rate: number;
}