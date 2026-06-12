import { useMemo } from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { Button } from "../../../../shared/components/Button/Button";
import PermissionsMatrix from "../PermissionsMatrix/PermissionsMatrix";
import { formatRole } from "../../utils/formatRole";
import type { User } from "../../types";

interface UserPermissionsDialogProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
    open,
    onClose,
    user,
}) => {
    const activePermissions = useMemo(
        () => new Set(user?.effectivePermissions ?? []),
        [user]
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Permisos de {user?.name ?? ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rol: {formatRole(user?.role ?? "")}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <PermissionsMatrix
                    activePermissions={activePermissions}
                    onToggle={() => {}}
                    readOnly
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserPermissionsDialog;
