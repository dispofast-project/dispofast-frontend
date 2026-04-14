import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
    requiredAuthorities?: string[];
}

export const ProtectedRoute = ({ requiredAuthorities }: ProtectedRouteProps) => {

    const { isAuthenticated, authorities: userAuthorities } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredAuthorities && requiredAuthorities.length > 0) {
        const hasAuthority = requiredAuthorities.some(auth => userAuthorities.includes(auth));

        if (!hasAuthority) {
            return <Navigate to="/no-access" replace />;
        }
    }

    return <Outlet />;
}