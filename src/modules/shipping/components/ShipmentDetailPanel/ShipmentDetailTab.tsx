import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ShipmentStatusBadge } from "../ShipmentStatusBadge/ShipmentStatusBadge";
import { formatDate, formatCOP } from "../../utils/shipmentUtils";
import type { Shipment } from "../../types";

interface Props {
  shipment: Shipment;
}

const labelSx = {
  display: "block",
  fontSize: "0.625rem",
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase" as const,
  color: "text.disabled",
  mb: 0.5,
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box>
    <Typography sx={labelSx}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
      {children}
    </Typography>
  </Box>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Paper
    elevation={0}
    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}
  >
    <Box
      sx={{
        px: 2.5,
        py: 1.25,
        bgcolor: "grey.50",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography sx={{ ...labelSx, mb: 0 }}>{title}</Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Paper>
);

export const ShipmentDetailTab = ({ shipment }: Props) => {
  const deliveryLabel =
    shipment.deliveryType === "CONDUCTOR"
      ? "Conductor"
      : shipment.deliveryType === "TRANSPORTADORA"
        ? "Transportadora"
        : "Forma de entrega";

  const totalUnits = shipment.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const grandTotal =
    shipment.items?.reduce((sum, item) => {
      const iva = item.taxPercent ? item.total * (item.taxPercent / 100) : 0;
      return sum + item.total + iva;
    }, 0) ?? 0;
  const itemCount = shipment.items?.length ?? 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Section title="Información general">
        <Box
          sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}
        >
          <Box>
            <Typography sx={labelSx}>Estado</Typography>
            <ShipmentStatusBadge state={shipment.state} />
          </Box>
          <Field label="Cliente">{shipment.clientName || "—"}</Field>
          <Field label="Factura">{shipment.invoiceNumber || "—"}</Field>
          <Field label="Fecha estimada de entrega">
            {formatDate(shipment.estimatedDeliveryDate) || "Sin definir"}
          </Field>
        </Box>
      </Section>

      <Section title="Entrega">
        <Box
          sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}
        >
          <Field label={deliveryLabel}>
            {shipment.deliveryType === "CONDUCTOR"
              ? (shipment.driver?.name || "Sin asignar")
              : shipment.deliveryType === "TRANSPORTADORA"
                ? (shipment.carrier?.name || "Sin asignar")
                : "Recoge en bodega"}
          </Field>
          {shipment.deliveryType === "CONDUCTOR" && (
            <Field label="Vehículo">{shipment.vehicle?.plate || "Sin asignar"}</Field>
          )}
          {shipment.city && (
            <Field label="Ciudad">
              {shipment.city.name}
              {shipment.city.department ? `, ${shipment.city.department.name}` : ""}
            </Field>
          )}
          <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
            <Field label="Dirección">{shipment.deliveryAddress || "—"}</Field>
          </Box>
          {shipment.addressDetail && (
            <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
              <Field label="Detalle de dirección">{shipment.addressDetail}</Field>
            </Box>
          )}
        </Box>
      </Section>

      <Box>
        <Typography sx={{ ...labelSx, mb: 1.5 }}>
          Productos · {itemCount} referencia{itemCount !== 1 ? "s" : ""}
        </Typography>
        {shipment.items && shipment.items.length > 0 ? (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  {["Código", "Nombre", "Cant.", "V. Unit", "IVA", "Total"].map((h, i) => (
                    <TableCell
                      key={h}
                      align={i >= 2 ? "right" : "left"}
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1.25,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {shipment.items.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                      {item.productSku || "—"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{item.productName}</TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.8rem" }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.8rem" }}>
                      {formatCOP(item.unitPrice)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                      {item.taxPercent != null && item.taxPercent > 0
                        ? formatCOP(item.total * item.taxPercent / 100)
                        : "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      {formatCOP(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.25,
                borderTop: "2px solid",
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {totalUnits} unidad{totalUnits !== 1 ? "es" : ""} · {itemCount} referencia
                {itemCount !== 1 ? "s" : ""}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatCOP(grandTotal)}
              </Typography>
            </Box>
          </TableContainer>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Sin productos registrados
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
