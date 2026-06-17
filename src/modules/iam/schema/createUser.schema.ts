import { z } from "zod";

const createUserSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .max(100, { message: "El nombre no puede exceder 100 caracteres" }),
    email: z
        .string()
        .email({ message: "El correo electrónico no es válido" }),
    password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    roleId: z
        .string()
        .min(1, { message: "Debe seleccionar un rol" }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export default createUserSchema;
