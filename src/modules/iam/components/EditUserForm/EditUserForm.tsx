import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Divider, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Input } from "../../../../shared/components/Input/Input";
import { Button } from "../../../../shared/components/Button/Button";
import Dropdown from "../../../../shared/components/Dropdown/Dropdown";
import { getAllRoles } from "../../api/role.service";
import { updateUser } from "../../api/user.service";
import updateUserSchema, { type UpdateUserFormData } from "../../schema/updateUser.schema";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import { formatRole } from "../../utils/formatRole";
import type { Role, User } from "../../types";

interface EditUserFormProps {
    user: User;
    onSuccess: (updated: User) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSuccess }) => {
    const { showNotification } = useNotificationStore();

    const [roles, setRoles] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        mode: "onChange",
        defaultValues: { name: user.name, email: user.email, roleId: "" },
    });

    const selectedRoleId = watch("roleId");

    useEffect(() => {
        getAllRoles()
            .then((fetchedRoles) => {
                setRoles(fetchedRoles);
                // Pre-select the user's current role
                const current = fetchedRoles.find((r) => r.name === user.role);
                if (current) setValue("roleId", current.id, { shouldValidate: true });
            })
            .catch(() => showNotification("Error al cargar los roles", "error"))
            .finally(() => setRolesLoading(false));
    }, []);

    const onSubmit = async (data: UpdateUserFormData) => {
        setIsSaving(true);
        try {
            const updated = await updateUser(user.id, data);
            showNotification("Usuario actualizado exitosamente", "success");
            onSuccess(updated);
        } catch {
            showNotification("Error al actualizar el usuario", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const roleOptions = roles
        .filter((r) => r.name !== "ADMIN")
        .map((r) => ({ value: r.id, label: formatRole(r.name) }));

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Nombre completo"
                    error={errors.name?.message}
                    {...register("name")}
                />
                <Input
                    label="Correo electrónico"
                    type="email"
                    error={errors.email?.message}
                    {...register("email")}
                />
            </Box>

                <Box className="flex flex-col gap-1 max-w-xs">
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

            <Divider />

            <Box className="flex flex-col gap-1">
                <Typography variant="body2" color="text.secondary">
                    Dejar en blanco para mantener la contraseña actual
                </Typography>
                <Box className="max-w-xs">
                    <Input
                        label="Nueva contraseña"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        error={errors.password?.message}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible((v) => !v)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none p-1.5"
                                aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {isPasswordVisible
                                    ? <VisibilityOffIcon fontSize="small" />
                                    : <VisibilityIcon fontSize="small" />}
                            </button>
                        }
                        {...register("password")}
                    />
                </Box>
            </Box>

            <Box className="flex justify-end pt-2">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!isValid || !isDirty || isSaving}
                    isLoading={isSaving}
                >
                    Guardar cambios
                </Button>
            </Box>
        </Box>
    );
};

export default EditUserForm;
