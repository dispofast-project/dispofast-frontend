import { Box, Skeleton, Typography } from "@mui/material";
import { History } from "lucide-react";
import { useShipmentHistory } from "../../hooks/useShipmentHistory";
import type { Shipment } from "../../types";

interface Props {
  shipment: Shipment;
}

export const ShipmentHistorialTab = ({ shipment }: Props) => {
  const { history, loading, error } = useShipmentHistory(shipment.id);

  if (loading) {
    return (
      <Box sx={{ pt: 1 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, mb: 3, alignItems: "flex-start" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.5 }}>
              <Skeleton variant="circular" width={12} height={12} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Skeleton width="55%" height={20} />
              <Skeleton width="35%" height={16} sx={{ mt: 0.5 }} />
            </Box>
            <Skeleton width={80} height={16} />
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ py: 6, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (history.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          gap: 1.5,
        }}
      >
        <History size={32} color="var(--mui-palette-text-disabled, #bdbdbd)" />
        <Typography color="text.secondary" variant="body2">
          Sin historial de cambios
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      {history.map((entry, index) => {
        const date = new Date(entry.changedAt);
        const isLast = index === history.length - 1;

        return (
          <Box key={entry.id} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            {/* Dot + connector */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                pt: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: index === 0 ? "primary.main" : "grey.400",
                  flexShrink: 0,
                }}
              />
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    flexGrow: 1,
                    minHeight: 32,
                    bgcolor: "divider",
                    my: 0.5,
                  }}
                />
              )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, pb: isLast ? 0 : 2.5 }}>
              <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.4 }}>
                {entry.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {entry.userEmail}
              </Typography>
            </Box>

            {/* Date */}
            <Box sx={{ flexShrink: 0, textAlign: "right", pt: 0.25 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {date.toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: "block" }}>
                {date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
