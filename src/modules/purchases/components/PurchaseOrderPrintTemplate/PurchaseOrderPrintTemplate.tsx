import { forwardRef } from "react";
import logo from "../../../../assets/dispofast-logo.png";

const PRIMARY = "#4676B8";

const fmt = (n: number | null | undefined): string => {
  if (n == null) return "$0,00";
  return `$${n.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const fmtRate = (rate: number): string => {
  const pct = rate * 100;
  return `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`;
};

const fmtDate = (dateStr: string): string => {
  const d = dateStr.includes("T") ? new Date(dateStr) : new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
};

const InfoCell = ({ label, value }: { label: string; value: string }) => (
  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", verticalAlign: "top" }}>
    <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 12, fontWeight: 500 }}>{value}</div>
  </td>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ color: PRIMARY, fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>
    {children}
  </div>
);

export interface PurchaseOrderPrintItem {
  productReference: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface PurchaseOrderPrintTemplateProps {
  orderNumber: string;
  createdAt: string | null;
  isDraft?: boolean;
  supplierName: string;
  identificationNumber?: string;
  email?: string;
  phone?: string;
  city?: string;
  department?: string;
  address?: string;
  buyerName: string;
  paymentCondition: string | null;
  commercialDiscountRate: number;
  otherDiscountsRate: number;
  items: PurchaseOrderPrintItem[];
  subtotalAmount: number;
  commercialDiscountAmount: number;
  otherDiscountsAmount: number;
  ivaAmount: number;
  retefuenteAmount: number;
  totalAmount: number;
  freight: number;
}

const PurchaseOrderPrintTemplate = forwardRef<HTMLDivElement, PurchaseOrderPrintTemplateProps>(
  (
    {
      orderNumber,
      createdAt,
      isDraft,
      supplierName,
      identificationNumber,
      email,
      phone,
      city,
      department,
      address,
      buyerName,
      paymentCondition,
      commercialDiscountRate,
      otherDiscountsRate,
      items,
      subtotalAmount,
      commercialDiscountAmount,
      otherDiscountsAmount,
      ivaAmount,
      retefuenteAmount,
      totalAmount,
      freight,
    },
    ref
  ) => {
    const dateLabel = createdAt ? fmtDate(createdAt) : "-";

    type PaymentRow = { label: string; value: string; negative?: boolean };
    const paymentRows: PaymentRow[] = [
      { label: "Subtotal", value: fmt(subtotalAmount) },
    ];
    if (commercialDiscountAmount > 0) {
      paymentRows.push({
        label: `Desc. comercial (${fmtRate(commercialDiscountRate)})`,
        value: `-${fmt(commercialDiscountAmount)}`,
        negative: true,
      });
    }
    if (otherDiscountsAmount > 0) {
      paymentRows.push({
        label: `Otros descuentos (${fmtRate(otherDiscountsRate)})`,
        value: `-${fmt(otherDiscountsAmount)}`,
        negative: true,
      });
    }
    paymentRows.push({ label: "IVA", value: fmt(ivaAmount) });
    if (retefuenteAmount > 0) {
      paymentRows.push({
        label: "Retefuente",
        value: `-${fmt(retefuenteAmount)}`,
        negative: true,
      });
    }
    if (freight > 0) {
      paymentRows.push({ label: "Flete", value: fmt(freight) });
    }

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
        {/* ── HEADER ──────────────────────────────────────────────────────────── */}
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
          <img src={logo} alt="Dispofast" style={{ height: 55, objectFit: "contain" }} />
          <div style={{ textAlign: "right", fontSize: 10, color: "#555", lineHeight: 1.7 }}>
            <div>Linea de Atención Nacional</div>
            <div>Fijo: (602) 4899400</div>
            <div>Móvil: (57) 317 405 2094</div>
          </div>
        </div>

        {/* ── SUPPLIER BAND ───────────────────────────────────────────────────── */}
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
            <div style={{ fontWeight: "bold", color: PRIMARY, fontSize: 14 }}>{supplierName}</div>
            {identificationNumber && (
              <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>
                NIT: {identificationNumber}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#777" }}>{dateLabel}</div>
            <div style={{ marginTop: 2 }}>
              <span style={{ fontSize: 12, color: "#555" }}>orden de compra # </span>
              <span style={{ fontWeight: "bold", fontSize: 20, color: "#222" }}>{orderNumber}</span>
            </div>
            {isDraft && (
              <div
                style={{
                  display: "inline-block",
                  marginTop: 4,
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: "2px 8px",
                  borderRadius: 3,
                  letterSpacing: 1,
                }}
              >
                BORRADOR
              </div>
            )}
          </div>
        </div>

        {/* ── INFORMACIÓN PROVEEDOR ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Información proveedor</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <InfoCell label="Nombre" value={supplierName} />
                <InfoCell label="NIT / Cédula" value={identificationNumber ?? "-"} />
                <InfoCell label="Teléfono" value={phone ?? "-"} />
              </tr>
              <tr>
                <InfoCell label="Departamento" value={department ?? "-"} />
                <InfoCell label="Ciudad" value={city ?? "-"} />
                <InfoCell label="Correo" value={email ?? "-"} />
              </tr>
              {address && (
                <tr>
                  <InfoCell label="Dirección" value={address} />
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }} colSpan={2} />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── TÉRMINOS ────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Términos</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <InfoCell label="Condiciones de pago" value={paymentCondition ?? "No aplica"} />
                <InfoCell
                  label="Descuento comercial"
                  value={commercialDiscountRate > 0 ? fmtRate(commercialDiscountRate) : "No aplica"}
                />
                <InfoCell
                  label="Otros descuentos"
                  value={otherDiscountsRate > 0 ? fmtRate(otherDiscountsRate) : "No aplica"}
                />
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── LISTADO DE PRODUCTOS ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Listado de productos</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY, color: "#fff" }}>
                {(
                  [
                    ["Código", "center"],
                    ["Producto", "left"],
                    ["Costo Unit", "center"],
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
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: "12px", textAlign: "center", color: "#999", fontSize: 11 }}
                  >
                    Sin productos
                  </td>
                </tr>
              ) : (
                items.map((item, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f5f7fa" }}>
                    <td style={tdCenter}>{item.productReference}</td>
                    <td style={tdLeft}>{item.productName}</td>
                    <td style={tdCenter}>{item.unitPrice.toLocaleString("es-CO")}</td>
                    <td style={tdCenter}>{item.quantity}</td>
                    <td style={tdCenter}>{fmt(item.subtotal)}</td>
                    <td style={tdCenter}>{fmt(item.taxAmount)}</td>
                    <td style={tdCenter}>{fmt(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── DETALLES DE PAGO ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <div style={{ width: 300, flexShrink: 0 }}>
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
            {paymentRows.map(({ label, value, negative }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 12px",
                  backgroundColor: PRIMARY,
                  color: negative ? "#ffd6d6" : "#fff",
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
              <span>{fmt(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* ── COMPRADOR ───────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Comprador:</SectionTitle>
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
            <span>{buyerName}</span>
            <span style={{ color: "#777" }}>Correo:</span>
            <span>-</span>
            <span style={{ color: "#777" }}>Teléfono:</span>
            <span>-</span>
            <span style={{ color: "#777" }}>Celular:</span>
            <span>-</span>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
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
          <span>Linea de Atención Nacional - Fijo: (602) 4899400 - Móvil: (57) 317 405 2094</span>
        </div>
      </div>
    );
  }
);

const tdBase: React.CSSProperties = { padding: "5px 8px", borderBottom: "1px solid #e8e8e8" };
const tdCenter: React.CSSProperties = { ...tdBase, textAlign: "center" };
const tdLeft: React.CSSProperties = { ...tdBase, textAlign: "left" };

PurchaseOrderPrintTemplate.displayName = "PurchaseOrderPrintTemplate";

export default PurchaseOrderPrintTemplate;
