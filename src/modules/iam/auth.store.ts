import type { AuthenticatedUser, AuthState } from "./types";
import { persist, devtools } from "zustand/middleware"
import { create } from "zustand";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    sub?: string;
    email?: string;
    name?: string;
    userId?: string;
    exp?: number;
    authorities?: string[];
}

const initialState: Omit<AuthState, "login" | "logout" | "checkAuth"> = {
    user: null,
    token: null,
    isAuthenticated: false,
    authorities: [],
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                logout: () => {
                    set(initialState);
                },

                login: (data) => {
                    const { token: rawToken, user } = data;

                    const normalizedToken = typeof rawToken === "string" ? rawToken : null;
                    const token = normalizedToken?.startsWith("Bearer ")
                        ? normalizedToken.slice(7)
                        : normalizedToken;

                    if (!token) {
                        console.error("La respuesta de inicio de sesión no contiene un token válido.");
                        throw new Error("TOKEN_MISSING");
                    }

                    let decodedToken: DecodedToken = {};
                    try {
                        decodedToken = jwtDecode(token);
                    } catch (error) {
                        console.error("Error al decodificar el token JWT:", error);
                    }

                    // Preferir authorities del JWT (incluye ROLE_X + permisos efectivos).
                    // Como fallback, usar effectivePermissions de la respuesta del login.
                    const authorities: string[] = decodedToken.authorities?.length
                        ? decodedToken.authorities
                        : user?.effectivePermissions ?? [];

                    const baseUser: AuthenticatedUser = {
                        id: user?.id ?? decodedToken?.userId ?? decodedToken?.sub ?? decodedToken?.email ?? "",
                        name: user?.name ?? decodedToken?.name ?? '',
                        email: user?.email ?? decodedToken?.email ?? '',
                        role: user?.role ?? '',
                        effectivePermissions: user?.effectivePermissions ?? [],
                    };

                    set({
                        token,
                        user: baseUser,
                        isAuthenticated: true,
                        authorities,
                    });

                    get().checkAuth();
                },

                checkAuth: () => {
                    const { token, user } = get();

                    if (!token) {
                        if (user) {
                            get().logout();
                        }
                        return;
                    }

                    let decodedToken: DecodedToken = {};
                    try {
                        decodedToken = jwtDecode(token);
                    } catch (error) {
                        console.error('No se pudo decodificar el token JWT en checkAuth.', error);
                        return;
                    }

                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp && decodedToken.exp < currentTime) {
                        get().logout();
                        return;
                    }
                }
            }),
            {
                name: "auth-storage",
            }
        ),
        {
            name: "AuthStore",
        }
    )
)
