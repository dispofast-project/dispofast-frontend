import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
    permitedRoles?: string[];
}

export const ProtectedRoute = ({ permitedRoles }: ProtectedRouteProps) => {

    const { isAuthenticated, authorities: userAuthorities } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/" replace/>
    }

    if(permitedRoles && permitedRoles.length > 0) {
        const hasRequiredRole = permitedRoles.some(role => userAuthorities.includes(role));

        if(!hasRequiredRole) {
            return <Navigate to="/no-access" replace/>
        }
    }

    return <Outlet />
}