export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        roles: string[];
    }
}

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
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
    roles: string[];
    createdAt: string;
    updatedAt: string;
}