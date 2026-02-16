import { useState } from "react";
import type { LoginFormData } from "../../types";
import { useForm } from "react-hook-form";
import loginSchema from "../../schema/login.schema";
import { zodResolver } from "@hookform/resolvers/zod/src/index.js";
import { Box } from "@mui/material";
import { Input } from "../../../../shared/components/Input/Input";
import { Button } from "../../../../shared/components/Button/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    })

    const onSubmitHandler = (data: LoginFormData) => {
        onSubmit(data);   
    }

    return (
        <Box component="div" className="flex flex-col gap-4">
            <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4">
                <Input
                    label="Correo electrónico"
                    id="email"
                    test-id="email-input"
                    placeholder="Ingresa tu correo electrónico"
                    error={errors.email?.message}
                    type="email"
                    {...register("email")}
                />

                <Input
                    label="Contraseña"
                    id="password"
                    test-id="password-input"
                    placeholder="Ingresa tu contraseña"
                    error={errors.password?.message}
                    type={isPasswordVisible ? "text" : "password"}
                    rightElement={
                        <button 
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            type="button"
                            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1.5"
                            aria-label={
                                isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                            }
                        >
                            {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                    }
                    {...register("password")}
                />

                <Button 
                    type="submit"
                    disabled={!isValid}
                    data-testid="submit-button"
                    className="w-full"
                >
                    Iniciar sesión
                </Button>
                
            </Box>
        </Box>
    )
}

export default LoginForm;