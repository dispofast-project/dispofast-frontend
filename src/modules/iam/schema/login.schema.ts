import z from "zod";

const loginSchema = z.object({
    email: z.email({ error: "El correo electrónico no es válido" }),
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
})

export type LoginFormData = z.infer<typeof loginSchema>;

export default loginSchema;