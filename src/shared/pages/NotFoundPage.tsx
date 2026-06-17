import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button/Button";
import notFoundImage from "../../assets/not-found.png";

const NotFoundPage = () => {

    const navigate = useNavigate();

    return (
        <Box className="flex flex-col items-center justify-center h-full gap-4 px-4">
            <Box className="flex items-center justify-center" >
                <img src={notFoundImage} alt="Página no encontrada" style={{ maxWidth: "80%", height: "auto" }} />
            </Box>

            <Typography variant="h3" sx={{ color: "text.secondary" }}>
                Página no encontrada
            </Typography>

            <Button variant="primary" onClick={() => navigate("/dashboard")}>
                Volver a la página principal
            </Button>
            
        </Box>
    )
}

export default NotFoundPage;