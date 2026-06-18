import {
    Box,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {
    ACTIONS,
    ACTION_LABELS,
    buildPermissionName,
    MODULES,
    MODULE_LABELS,
} from "../../config/permissions";

interface PermissionsMatrixProps {
    activePermissions: Set<string>;
    onToggle: (permissionName: string, checked: boolean) => void;
    readOnly?: boolean;
}

const PermissionsMatrix: React.FC<PermissionsMatrixProps> = ({
    activePermissions,
    onToggle,
    readOnly = false,
}) => {
    return (
        <Box className="overflow-x-auto">
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.50" }}>
                        <TableCell sx={{ fontWeight: "bold", minWidth: 160 }}>
                            Módulo
                        </TableCell>
                        {ACTIONS.map((action) => (
                            <TableCell
                                key={action}
                                align="center"
                                sx={{ fontWeight: "bold", minWidth: 80 }}
                            >
                                {ACTION_LABELS[action]}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {MODULES.map((module) => (
                        <TableRow
                            key={module}
                            sx={{ "&:last-child td": { borderBottom: 0 } }}
                        >
                            <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                    {MODULE_LABELS[module]}
                                </Typography>
                            </TableCell>
                            {ACTIONS.map((action) => {
                                const permName = buildPermissionName(module, action);
                                return (
                                    <TableCell key={action} align="center" padding="checkbox">
                                        <Checkbox
                                            checked={activePermissions.has(permName)}
                                            disabled={readOnly}
                                            onChange={(e) => onToggle(permName, e.target.checked)}
                                            size="small"
                                            sx={{ color: "primary.light" }}
                                        />
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default PermissionsMatrix;
