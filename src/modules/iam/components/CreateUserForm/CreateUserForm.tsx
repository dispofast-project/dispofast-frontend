import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Divider, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Input } from "../../../../shared/components/Input/Input";
import { Button } from "../../../../shared/components/Button/Button";
import Dropdown from "../../../../shared/components/Dropdown/Dropdown";
import PermissionsMatrix from "../PermissionsMatrix/PermissionsMatrix";
import { getAllRoles } from "../../api/role.service";
import { createUser, updateUserPermissions } from "../../api/user.service";
import createUserSchema, { type CreateUserFormData } from "../../schema/createUser.schema";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import { formatRole } from "../../utils/formatRole";
import type { PermissionSummary, Role } from "../../types";

interface CreateUserFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, onCancel }) => {
    const { showNotification } = useNotificationStore();

    const [roles, setRoles] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Full permission list for the selected role (needed to compute overrides on submit)
    const [allPermissionsForRole, setAllPermissionsForRole] = useState<PermissionSummary[]>([]);
    // Active (granted) permission names — drives the matrix checkboxes
    const [activePermissions, setActivePermissions] = useState<Set<string>>(new Set());

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { name: "", email: "", password: "", roleId: "" },
        mode: "onChange",
    });

    const selectedRoleId = watch("roleId");

    useEffect(() => {
        getAllRoles()
            .then(setRoles)
            .catch(() => showNotification("Error al cargar los roles", "error"))
            .finally(() => setRolesLoading(false));
    }, []);

    // When role changes, reset the permissions matrix to the role's defaults
    useEffect(() => {
        if (!selectedRoleId) return;
        const role = roles.find((r) => r.id === selectedRoleId);
        if (!role) return;
        setAllPermissionsForRole(role.permissions);
        setActivePermissions(
            new Set(role.permissions.filter((p) => p.grantedByRole).map((p) => p.name))
        );
    }, [selectedRoleId, roles]);

    const handlePermissionToggle = (permName: string, checked: boolean) => {
        setActivePermissions((prev) => {
            const next = new Set(prev);
            checked ? next.add(permName) : next.delete(permName);
            return next;
        });
    };

    const onSubmit = async (data: CreateUserFormData) => {
        setIsSubmitting(true);
        try {
            const newUser = await createUser(data);

            // Only patch permissions that differ from the role's defaults
            const overrides = allPermissionsForRole
                .filter((p) => p.grantedByRole !== activePermissions.has(p.name))
                .map((p) => ({
                    permissionId: p.id,
                    permissionName: p.name,
                    granted: activePermissions.has(p.name),
                }));

            if (overrides.length > 0) {
                try {
                    await updateUserPermissions(newUser.id, overrides);
                } catch {
                    showNotification(
                        "Usuario creado, pero hubo un error al guardar los permisos personalizados.",
                        "warning"
                    );
                    onSuccess();
                    return;
                }
            }

            showNotification("Usuario creado exitosamente", "success");
            onSuccess();
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : "Error al crear el usuario";
            showNotification(msg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const roleOptions = roles.map((r) => ({ value: r.id, label: formatRole(r.name) }));

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
        >
            {/* Datos básicos */}
            <Box className="flex flex-col gap-4">
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    Información del usuario
                </Typography>

                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Nombre completo"
                        placeholder="Ej. Juan Pérez"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        label="Correo electrónico"
                        type="email"
                        placeholder="correo@empresa.com"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                </Box>

                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Contraseña"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        error={errors.password?.message}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible((v) => !v)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none p-1.5"
                                aria-label={
                                    isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                            >
                                {isPasswordVisible ? (
                                    <VisibilityOffIcon fontSize="small" />
                                ) : (
                                    <VisibilityIcon fontSize="small" />
                                )}
                            </button>
                        }
                        {...register("password")}
                    />

                    <Box className="flex flex-col gap-1">
                        <Dropdown
                            label="Rol"
                            options={roleOptions}
                            value={selectedRoleId}
                            onChange={(val) => setValue("roleId", val, { shouldValidate: true })}
                            placeholder={rolesLoading ? "Cargando roles…" : "Seleccionar rol"}
                            disabled={rolesLoading}
                            fullWidth
                            size="medium"
                        />
                        {errors.roleId && (
                            <Typography variant="caption" color="error">
                                {errors.roleId.message}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Matriz de permisos — solo aparece cuando hay un rol seleccionado */}
            {selectedRoleId && (
                <>
                    <Divider />
                    <Box className="flex flex-col gap-3">
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                Permisos personalizados
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Basados en el rol seleccionado. Puedes modificarlos para este usuario.
                            </Typography>
                        </Box>
                        <PermissionsMatrix
                            activePermissions={activePermissions}
                            onToggle={handlePermissionToggle}
                        />
                    </Box>
                </>
            )}

            {/* Acciones */}
            <Box className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                >
                    Crear usuario
                </Button>
            </Box>
        </Box>
    );
};

export default CreateUserForm;
