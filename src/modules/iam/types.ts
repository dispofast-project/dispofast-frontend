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