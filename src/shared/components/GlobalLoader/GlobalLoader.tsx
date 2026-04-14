import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";
import { useAppSelector } from "../../hooks/redux";

const GlobalLoader = () => {
  const isLoading = useAppSelector((state) => state.loading.global);

  return (
    <Backdrop
      open={isLoading}
      sx={{ zIndex: 9999, flexDirection: "column", gap: 2, color: "#fff", backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)" }}
    >
      <CircularProgress
        size={52}
        thickness={4}
        sx={{ color: "var(--dispofast-primary)" }}
      />
      <Box>
        <Typography variant="body2" sx={{ color: "var(--dispofast-primary)", fontWeight: 500 }}>
          Cargando...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalLoader;
