import z from "zod";

const loginSchema = z.object({
    email: z.email({ error: "Email invalido" }),
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
})

export type LoginFormData = z.infer<typeof loginSchema>;

export default loginSchema;