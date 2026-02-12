import type { AuthState } from "./types";
import { persist, devtools } from "zustand/middleware"
import { create } from "zustand";

interface DecodedToken {

}

const initialState: Omit<AuthState, "login" | "logout" | "checkAuth"> = {
    user: null,
    token: null,
    isAuthenticated: false,
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
                    const { token: rawToken, user, ...profiles } = data;

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
                        decodedToken = 
                    } catch (error) {
                        
                    }
                },

                checkAuth: () => {

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
