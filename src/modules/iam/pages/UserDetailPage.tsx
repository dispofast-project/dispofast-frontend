import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";
import CustomTitle from "../../../shared/components/Title/Title";
import EditUserForm from "../components/EditUserForm/EditUserForm";
import UserGoalsSection from "../components/UserGoalsSection/UserGoalsSection";
import { getUserById } from "../api/user.service";
import { useNotificationStore } from "../../../shared/store/notification.store";
import { formatRole } from "../utils/formatRole";
import type { User } from "../types";

const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showNotification } = useNotificationStore();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getUserById(id)
            .then(setUser)
            .catch(() => {
                showNotification("No se pudo cargar el usuario", "error");
                navigate("/usuarios");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-64">
                <CircularProgress />
            </Box>
        );
    }

    if (!user) return null;

    return (
        <Box className="flex h-full flex-col space-y-6 max-w-4xl">
            {/* Cabecera */}
            <Box className="flex items-center gap-3 flex-shrink-0">
                <Button
                    variant="secondary"
                    onClick={() => navigate("/usuarios")}
                    className="!p-2 min-w-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <Box>
                    <CustomTitle
                        mainTitle={user.name}
                        description={`${formatRole(user.role)} · ${user.email}`}
                    />
                </Box>
            </Box>

            {/* Información del usuario */}
            <Box className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Typography variant="subtitle1" fontWeight={600} className="mb-4">
                    Información del usuario
                </Typography>
                <EditUserForm user={user} onSuccess={(updated) => setUser(updated)} />
            </Box>

            {/* Metas asesor */}
            <Box className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Typography variant="subtitle1" fontWeight={600} className="mb-2">
                    Metas asesor
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <UserGoalsSection userId={user.id} />
            </Box>
        </Box>
    );
};

export default UserDetailPage;
