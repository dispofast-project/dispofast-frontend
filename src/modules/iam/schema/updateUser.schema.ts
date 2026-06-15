import { z } from "zod";

const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .max(50, { message: "El nombre no puede exceder 50 caracteres" }),
    email: z
        .string()
        .email({ message: "El correo electrónico no es válido" })
        .max(70, { message: "El correo no puede exceder 70 caracteres" }),
    roleId: z.string().min(1, { message: "Debe seleccionar un rol" }),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default updateUserSchema;
