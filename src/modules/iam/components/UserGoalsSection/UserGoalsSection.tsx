import { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    IconButton,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { Input } from "../../../../shared/components/Input/Input";
import { Button } from "../../../../shared/components/Button/Button";
import Dropdown from "../../../../shared/components/Dropdown/Dropdown";
import { createUserGoal, deleteUserGoal, getUserGoals } from "../../api/user.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { GoalType, UserGoal } from "../../types";

interface UserGoalsSectionProps {
    userId: string;
}

const GOAL_TABS: { type: GoalType; label: string; valueLabel: string; isPercent?: boolean }[] = [
    { type: "SALES_QUOTA", label: "Cuota Ventas", valueLabel: "Meta venta" },
    { type: "COLLECTION_QUOTA", label: "Cuota Recaudos", valueLabel: "Meta recaudo" },
    { type: "COMMISSION", label: "Comisión Recaudo", valueLabel: "Comisión (%)", isPercent: true },
];

const MONTHS = [
    { value: 1, label: "Enero" }, { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" }, { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" }, { value: 6, label: "Junio" },
    { value: 7, label: "Julio" }, { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" }, { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" }, { value: 12, label: "Diciembre" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear - 1 + i;
    return { value: y, label: String(y) };
});

const formatValue = (value: number, isPercent?: boolean) => {
    if (isPercent) return `${value}%`;
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
};

const monthLabel = (month: number) =>
    MONTHS.find((m) => m.value === month)?.label ?? String(month);

interface GoalTabPanelProps {
    userId: string;
    type: GoalType;
    valueLabel: string;
    isPercent?: boolean;
}

const GoalTabPanel: React.FC<GoalTabPanelProps> = ({ userId, type, valueLabel, isPercent }) => {
    const { showNotification } = useNotificationStore();

    const [goals, setGoals] = useState<UserGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(currentYear);
    const [value, setValue] = useState("");

    const load = () => {
        setLoading(true);
        getUserGoals(userId, type)
            .then(setGoals)
            .catch(() => showNotification("Error al cargar las metas", "error"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [userId, type]);

    const handleAdd = async () => {
        const numValue = parseFloat(value.replace(/\./g, "").replace(",", "."));
        if (!numValue || numValue <= 0) {
            showNotification("El valor debe ser mayor a 0", "warning");
            return;
        }
        setIsAdding(true);
        try {
            const created = await createUserGoal(userId, { type, month, year, value: numValue });
            setGoals((prev) => [created, ...prev]);
            setValue("");
        } catch {
            showNotification("Error al agregar la meta. ¿Ya existe para ese mes/año?", "error");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (goalId: string) => {
        try {
            await deleteUserGoal(userId, goalId);
            setGoals((prev) => prev.filter((g) => g.id !== goalId));
        } catch {
            showNotification("Error al eliminar la meta", "error");
        }
    };

    return (
        <Box className="flex flex-col gap-4 pt-4">
            {/* Fila de agregar */}
            <Box className="flex flex-wrap items-end gap-3">
                <Box className="flex flex-col gap-1">
                    <Typography variant="caption" color="text.secondary">Mes</Typography>
                    <Dropdown
                        label=""
                        options={MONTHS.map((m) => ({ value: String(m.value), label: m.label }))}
                        value={String(month)}
                        onChange={(v) => setMonth(Number(v))}
                        size="small"
                        minWidth={130}
                    />
                </Box>

                <Box className="flex flex-col gap-1">
                    <Typography variant="caption" color="text.secondary">Año</Typography>
                    <Dropdown
                        label=""
                        options={YEARS.map((y) => ({ value: String(y.value), label: y.label }))}
                        value={String(year)}
                        onChange={(v) => setYear(Number(v))}
                        size="small"
                        minWidth={100}
                    />
                </Box>

                <Box className="flex flex-col gap-1 min-w-[160px]">
                    <Typography variant="caption" color="text.secondary">{valueLabel}</Typography>
                    <Input
                        label=""
                        type="number"
                        placeholder={isPercent ? "Ej. 5.5" : "Ej. 5500000"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Box>

                <Button
                    variant="primary"
                    onClick={handleAdd}
                    disabled={!value || isAdding}
                    isLoading={isAdding}
                >
                    Agregar
                </Button>
            </Box>

            {/* Tabla */}
            {loading ? (
                <Box className="flex justify-center py-8">
                    <CircularProgress size={28} />
                </Box>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>Mes</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Año</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>{valueLabel}</TableCell>
                            <TableCell padding="checkbox" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {goals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: "text.secondary", py: 3 }}>
                                    No hay metas registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            goals.map((g) => (
                                <TableRow key={g.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell>{monthLabel(g.month)}</TableCell>
                                    <TableCell>{g.year}</TableCell>
                                    <TableCell>{formatValue(g.value, isPercent)}</TableCell>
                                    <TableCell padding="checkbox">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(g.id)}
                                            sx={{ color: "error.light" }}
                                        >
                                            <Trash2 size={16} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
        </Box>
    );
};

const UserGoalsSection: React.FC<UserGoalsSectionProps> = ({ userId }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box>
            <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                {GOAL_TABS.map((t) => (
                    <Tab key={t.type} label={t.label} />
                ))}
            </Tabs>

            {GOAL_TABS.map((t, i) =>
                activeTab === i ? (
                    <GoalTabPanel
                        key={t.type}
                        userId={userId}
                        type={t.type}
                        valueLabel={t.valueLabel}
                        isPercent={t.isPercent}
                    />
                ) : null
            )}
        </Box>
    );
};

export default UserGoalsSection;
