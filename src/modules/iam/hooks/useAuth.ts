import { useAuthStore } from "../auth.store";

export const useAuth = () => useAuthStore((state) => state)