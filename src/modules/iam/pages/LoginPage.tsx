import { useState } from "react";
import { useNavigate } from "react-router-dom"
import type { LoginFormData } from "../types";
import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm/LoginForm";
import dispofastLogo from "../../../assets/dispofast-logo-white.png";
import heroLoginImage from "../../../assets/hero-login-page.jpg";
import { loginService } from "../api/auth.service";
import { useAuth } from "../hooks/useAuth";
import { isAxiosError } from "axios";
import { useNotificationStore } from "../../../shared/store";

const LoginPage = () => {

    const navigate = useNavigate();
    const {login} = useAuth();
    const {showNotification} = useNotificationStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
           const response = await loginService(data)

            login(response)

            navigate("/dashboard");
        } catch (error) {
            let message = 'Credenciales inválidas. Por favor, intente de nuevo.';

            if (error instanceof Error && error.message === 'TOKEN_MISSING') {
                message = 'La respuesta del servidor no incluyó un token de autenticación.';
            } else if (isAxiosError(error)) {
                const serverMessage = (error.response?.data as { message?: string })?.message;
                if (serverMessage) {
                    message = serverMessage;
                }
            } else if (error instanceof Error && error.message) {
                message = error.message;
            }

            showNotification(message, "error")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Box
            component="div"
            className="relative min-h-screen w-full"
            sx={{ backgroundImage: `url(${heroLoginImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <Box className="absolute inset-0 bg-black/40" />
            <Box className="relative z-10 w-full min-h-screen flex items-center">
                <Box className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-12 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
                    <Box className="w-full lg:w-1/2 text-white">
                        <img src={dispofastLogo} alt="dispofast logo" className="w-60 h-auto mb-8" />
                        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
                            Venta rápida, eficiente y segura.
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-white/80 max-w-md">
                            Toda la información de sus clientes a un click de distancia. Accede a toda la información de ventas y proyecciones en la palma de tu mano.
                        </p>
                    </Box>
                    <Box className="w-full lg:w-[420px] bg-white rounded-2xl shadow-2xl px-10 py-10 sm:px-10">
                        <h2 className="text-2xl font-semibold text-gray-900">¡Bienvenido de vuelta!</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Inicia sesion para acceder a la informacion de tus clientes.
                        </p>
                        <Box className="mt-6">
                            <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginPage;