import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import forbiddenImage from "../../assets/forbidden.png";
import { Button } from "../components/Button/Button";

const ForbiddenPage = () => {

    const navigate = useNavigate();
    return (
         <Box className="flex flex-col items-center justify-center h-full gap-4 px-4">
            <Box className="flex items-center justify-center" >
                <img src={forbiddenImage} alt="Acceso denegado" style={{ maxWidth: "80%", height: "auto" }} />
            </Box>

            <Typography variant="h3" sx={{ color: "text.secondary" }}>
                Acceso denegado
            </Typography>

            <Button variant="primary" onClick={() => navigate("/dashboard")}>
                Volver a la página principal
            </Button>
            
        </Box>
    );
}

export default ForbiddenPage;