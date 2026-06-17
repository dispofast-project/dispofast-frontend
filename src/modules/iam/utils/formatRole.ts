const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Administrador",
    VENDEDOR: "Vendedor",
    BODEGA: "Bodega",
};

export const formatRole = (role: string): string => {
    if (!role) return "-";
    return ROLE_LABELS[role] ?? role.charAt(0) + role.slice(1).toLowerCase();
};
