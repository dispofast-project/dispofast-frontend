import { forwardRef } from "react";
import type { SalesOrder } from "../../types";
import type { ClientResponse } from "../../../clients/types";
import logo from "../../../../assets/dispofast-logo.png";

const PRIMARY = "#4676B8";
const IVA_RATE = 0.19;

const PAYMENT_LABELS: Record<string, string> = {
  CONTADO: "Contado",
  CREDITO_15_DIAS: "Crédito 15 días",
  CREDITO_30_DIAS: "Crédito 30 días",
  CREDITO_60_DIAS: "Crédito 60 días",
  CREDITO_90_DIAS: "Crédito 90 días",
  CONTRAENTREGA: "Contra entrega",
};

const fmt = (n: number | null | undefined): string => {
  if (n == null) return "$0,00";
  return `$${n.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const fmtDate = (dateStr: string): string => {
  // Full ISO timestamp already has "T"; date-only strings need local midnight to avoid UTC offset
  const d = dateStr.includes("T") ? new Date(dateStr) : new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const InfoCell = ({ label, value }: { label: string; value: string }) => (
  <td
    style={{
      padding: "6px 10px",
      border: "1px solid #e0e0e0",
      verticalAlign: "top",
    }}
  >
    <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 12, fontWeight: 500 }}>{value}</div>
  </td>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: PRIMARY,
      fontWeight: "bold",
      fontSize: 13,
      marginBottom: 8,
    }}
  >
    {children}
  </div>
);

export interface OrderPrintTemplateProps {
  order: SalesOrder;
  client: ClientResponse | null;
  subtotal: number;
  tax: number;
  discountAmt: number;
  additionalDiscountAmt: number;
  retefuenteAmount: number;
  freight: number;
}

const OrderPrintTemplate = forwardRef<HTMLDivElement, OrderPrintTemplateProps>(
  (
    {
      order,
      client,
      subtotal,
      tax,
      discountAmt,
      additionalDiscountAmt,
      retefuenteAmount,
      freight,
    },
    ref
  ) => {
    const paymentLabel = order.paymentCondition
      ? (PAYMENT_LABELS[order.paymentCondition] ?? order.paymentCondition)
      : "-";
    const dateLabel = order.orderDate ? fmtDate(order.orderDate) : "-";

    const paymentRows: [string, string][] = [
      ["Subtotal", fmt(subtotal)],
      ["IVA", fmt(tax)],
      ["Retefuente", fmt(retefuenteAmount)],
      ["Descuento", fmt(discountAmt)],
      ["Otros descuentos", fmt(additionalDiscountAmt)],
      ["Flete", fmt(freight)],
    ];

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 12,
          color: "#333",
          backgroundColor: "#fff",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "2px solid #e0e0e0",
            paddingBottom: 14,
            marginBottom: 18,
          }}
        >
          <img
            src={logo}
            alt="Dispofast"
            style={{ height: 55, objectFit: "contain" }}
          />
          <div
            style={{
              textAlign: "right",
              fontSize: 10,
              color: "#555",
              lineHeight: 1.7,
            }}
          >
            <div>Linea de Atención Nacional</div>
            <div>Fijo: (602) 4899400</div>
            <div>Móvil: (57) 317 405 2094</div>
          </div>
        </div>

        {/* ── CLIENT BAND ────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            borderLeft: `4px solid ${PRIMARY}`,
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            padding: "10px 16px",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontWeight: "bold", color: PRIMARY, fontSize: 14 }}>
              {order.clientName}
            </div>
            <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>
              {order.clientName}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#777" }}>{dateLabel}</div>
            <div style={{ marginTop: 2 }}>
              <span style={{ fontSize: 12, color: "#555" }}>orden # </span>
              <span style={{ fontWeight: "bold", fontSize: 20, color: "#222" }}>
                {order.orderNumber}
              </span>
            </div>
          </div>
        </div>

        {/* ── INFORMACIÓN CLIENTE ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Información cliente</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <InfoCell label="Tipo cliente" value={client?.clientType?.name ?? "-"} />
                <InfoCell label="Nombre Cliente" value={order.clientName} />
                <InfoCell label="NIT" value={client?.identificationNumber ?? "-"} />
              </tr>
              <tr>
                <InfoCell label="Departamento" value={client?.city?.department?.name ?? "-"} />
                <InfoCell label="Ciudad" value={client?.city?.name ?? "-"} />
                <InfoCell label="Teléfono" value={client?.phone ?? "-"} />
              </tr>
              <tr>
                <InfoCell label="Correo" value={client?.email ?? "-"} />
                <InfoCell label="Ciudad (Despacho)" value={order.shipmentCityName ?? "-"} />
                <InfoCell label="Dirección (Despacho)" value={order.shipmentAddress ?? "-"} />
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── TÉRMINOS ────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Términos</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <InfoCell label="Condiciones de pago" value={paymentLabel} />
                <InfoCell label="Validez de la oferta" value="No aplica" />
                <InfoCell
                  label="Descuentos"
                  value={
                    order.discountRate ? `${order.discountRate}%` : "No aplica"
                  }
                />
                <InfoCell label="Pronto pago" value="No aplica" />
                <InfoCell
                  label="Otros descuentos"
                  value={
                    order.additionalDiscountRate
                      ? `${order.additionalDiscountRate}%`
                      : "No aplica"
                  }
                />
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── LISTADO DE PRODUCTOS ────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Listado de productos</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY, color: "#fff" }}>
                {(
                  [
                    ["Código", "center"],
                    ["Producto", "left"],
                    ["Valor Unit", "center"],
                    ["Cantidad", "center"],
                    ["Subtotal", "center"],
                    ["IVA", "center"],
                    ["Total", "center"],
                  ] as [string, string][]
                ).map(([label, align]) => (
                  <th
                    key={label}
                    style={{
                      padding: "7px 8px",
                      textAlign: align as "center" | "left",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((item, i) => {
                const ivaAmt = item.taxFree ? 0 : item.lineTotal * IVA_RATE;
                const rowTotal = item.lineTotal + ivaAmt;
                return (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#f5f7fa",
                    }}
                  >
                    <td style={tdCenter}>{item.productReference}</td>
                    <td style={tdLeft}>{item.productName}</td>
                    <td style={tdCenter}>
                      {item.unitPrice.toLocaleString("es-CO")}
                    </td>
                    <td style={tdCenter}>{item.quantity}</td>
                    <td style={tdCenter}>{fmt(item.lineTotal)}</td>
                    <td style={tdCenter}>{fmt(ivaAmt)}</td>
                    <td style={tdCenter}>{fmt(rowTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── OBSERVACIONES + DETALLES DE PAGO ───────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 20,
            alignItems: "flex-start",
          }}
        >
          {/* Observations */}
          <div style={{ flex: 1 }}>
            <SectionTitle>Observaciones:</SectionTitle>
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                padding: "8px 10px",
                minHeight: 110,
              }}
            />
          </div>

          {/* Payment panel */}
          <div style={{ width: 270, flexShrink: 0 }}>
            <div
              style={{
                backgroundColor: PRIMARY,
                color: "#fff",
                fontWeight: "bold",
                padding: "8px 12px",
                borderRadius: "4px 4px 0 0",
                fontSize: 13,
              }}
            >
              Detalles de pago
            </div>
            {paymentRows.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 12px",
                  backgroundColor: PRIMARY,
                  color: "#fff",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  fontSize: 12,
                }}
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 12px",
                backgroundColor: PRIMARY,
                color: "#fff",
                fontWeight: "bold",
                fontSize: 13,
                borderRadius: "0 0 4px 4px",
              }}
            >
              <span>Total</span>
              <span>{fmt(order.totalValue)}</span>
            </div>
          </div>
        </div>

        {/* ── ASESOR ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Asesor:</SectionTitle>
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: "10px 14px",
              display: "grid",
              gridTemplateColumns: "90px 1fr 90px 1fr",
              gap: "5px 0",
              fontSize: 12,
            }}
          >
            <span style={{ color: "#777" }}>Nombre:</span>
            <span>{order.asesorName ?? "-"}</span>
            <span style={{ color: "#777" }}>Correo:</span>
            <span>-</span>
            <span style={{ color: "#777" }}>Teléfono:</span>
            <span>-</span>
            <span style={{ color: "#777" }}>Celular:</span>
            <span>-</span>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid #e0e0e0",
            paddingTop: 8,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#777",
          }}
        >
          <span>www.dispofast.com</span>
          <span>
            Linea de Atención Nacional - Fijo: (602) 4899400 - Móvil: (57) 317
            405 2094
          </span>
        </div>
      </div>
    );
  }
);

const tdBase: React.CSSProperties = {
  padding: "5px 8px",
  borderBottom: "1px solid #e8e8e8",
};
const tdCenter: React.CSSProperties = { ...tdBase, textAlign: "center" };
const tdLeft: React.CSSProperties = { ...tdBase, textAlign: "left" };

OrderPrintTemplate.displayName = "OrderPrintTemplate";

export default OrderPrintTemplate;
