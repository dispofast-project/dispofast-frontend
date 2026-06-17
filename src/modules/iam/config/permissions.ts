export const MODULES = [
    "IAM",
    "CUSTOMERS",
    "INVENTORY",
    "PRODUCTS",
    "PURCHASE_ORDERS",
    "PRICE_LISTS",
    "QUOTES",
    "ACCOUNTS",
] as const;

export const ACTIONS = ["VIEW", "CREATE", "EDIT", "DELETE"] as const;

export type PermissionModule = (typeof MODULES)[number];
export type PermissionAction = (typeof ACTIONS)[number];

export const buildPermissionName = (
    module: PermissionModule,
    action: PermissionAction
): string => `${module}_${action}`;

export const MODULE_LABELS: Record<PermissionModule, string> = {
    IAM: "Usuarios",
    CUSTOMERS: "Clientes",
    INVENTORY: "Inventario",
    PRODUCTS: "Productos",
    PURCHASE_ORDERS: "Órdenes de compra",
    PRICE_LISTS: "Listas de precios",
    QUOTES: "Cotizaciones",
    ACCOUNTS: "Cartera",
};

export const ACTION_LABELS: Record<PermissionAction, string> = {
    VIEW: "Ver",
    CREATE: "Crear",
    EDIT: "Editar",
    DELETE: "Eliminar",
};
