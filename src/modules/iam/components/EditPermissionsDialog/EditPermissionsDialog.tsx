import { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { Button } from "../../../../shared/components/Button/Button";
import PermissionsMatrix from "../PermissionsMatrix/PermissionsMatrix";
import { getAllRoles } from "../../api/role.service";
import { updateUserPermissions } from "../../api/user.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import { formatRole } from "../../utils/formatRole";
import { ACTIONS } from "../../config/permissions";
import type { PermissionSummary, User } from "../../types";

interface EditPermissionsDialogProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

const EditPermissionsDialog: React.FC<EditPermissionsDialogProps> = ({
    open,
    onClose,
    user,
}) => {
    const { showNotification } = useNotificationStore();

    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [allPermissionsForRole, setAllPermissionsForRole] = useState<PermissionSummary[]>([]);
    const [activePermissions, setActivePermissions] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!open || !user) return;

        setLoading(true);
        getAllRoles()
            .then((fetchedRoles) => {
                const userRole = fetchedRoles.find(
                    (r) => r.name === user.role
                );
                if (userRole) {
                    setAllPermissionsForRole(userRole.permissions);
                }
                // Seed the matrix from effectivePermissions already loaded in the user object
                setActivePermissions(new Set(user.effectivePermissions));
            })
            .catch(() => showNotification("Error al cargar los permisos", "error"))
            .finally(() => setLoading(false));
    }, [open, user]);

    const handleToggle = (permName: string, checked: boolean) => {
        setActivePermissions((prev) => {
            const next = new Set(prev);
            if (checked) {
                next.add(permName);
            } else {
                next.delete(permName);
                if (permName.endsWith("_VIEW")) {
                    const module = permName.slice(0, -"_VIEW".length);
                    ACTIONS.forEach((action) => next.delete(`${module}_${action}`));
                }
            }
            return next;
        });
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            // Send all permissions that differ from the role's base defaults
            const overrides = allPermissionsForRole
                .filter((p) => p.grantedByRole !== activePermissions.has(p.name))
                .map((p) => ({
                    permissionId: p.id,
                    permissionName: p.name,
                    granted: activePermissions.has(p.name),
                }));

            await updateUserPermissions(user.id, overrides);
            showNotification("Permisos actualizados exitosamente", "success");
            onClose();
        } catch {
            showNotification("Error al actualizar los permisos", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (isSaving) return;
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Editar permisos de {user?.name ?? ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rol base: {formatRole(user?.role ?? "")}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Box className="flex justify-center items-center py-12">
                        <CircularProgress size={32} />
                    </Box>
                ) : (
                    <Box className="flex flex-col gap-3">
                        <Typography variant="body2" color="text.secondary">
                            Los permisos marcados están activos para este usuario. Los cambios se
                            aplicarán sobre los permisos base del rol.
                        </Typography>
                        <PermissionsMatrix
                            activePermissions={activePermissions}
                            onToggle={handleToggle}
                        />
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={loading || isSaving}
                    isLoading={isSaving}
                >
                    Guardar cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPermissionsDialog;
