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
                    const { token: rawToken, user} = data;

                    const normalizedToken = typeof rawToken === "string" ? rawToken : null;
                    const token = normalizedToken?.startsWith("Bearer ") 
                        ? normalizedToken.slice(7) 
                        : normalizedToken;

                    if(!token) {
                        console.error("La respuesta de inicio de sesión no contiene un token válido.");
                        throw new Error("TOKEN_MISSING");
                    }

                    let decodedToken: DecodedToken = {};

                    try {
                        decodedToken = jwtDecode(token);
                    } catch (error) {
                        console.error("Error al decodificar el token JWT:", error);
                    }

                    const authorities = decodedToken.authorities 
                        ? decodedToken.authorities 
                        : [];

                    const baseUser: AuthenticatedUser = {
                        id: 
                            user?.id ??
                            decodedToken?.userId ??
                            decodedToken?.sub ??
                            decodedToken?.email ??
                            "",
                        name: 
                            user?.name ??
                            decodedToken?.name ?? '',
                        email: 
                            user?.email ??
                            decodedToken?.email ?? '',
                        roles:
                            user.roles ?? authorities,
                    }
                    
                    set({
                        token: token || null,
                        user: baseUser,
                        isAuthenticated: true,
                        authorities: authorities
                    })

                    get().checkAuth();
                    console.log("Usuario autenticado:", baseUser);
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
                        console.error(
                        'No se pudo decodificar el token JWT en checkAuth.',
                        error
                        );
                        // Do not logout on decode errors; keep current session
                        return;
                    }
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp && decodedToken.exp < currentTime) {
                        get().logout();
                        return;
                    }

                    if (!user) {
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
