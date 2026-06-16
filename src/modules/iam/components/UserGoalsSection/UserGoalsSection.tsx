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
import {
    createUserGoal,
    createUserCommissionRate,
    deleteUserGoal,
    deleteUserCommissionRate,
    getCategories,
    getUserCommissionRates,
    getUserGoals,
} from "../../api/user.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Category, GoalType, UserCommissionRate, UserGoal } from "../../types";

interface UserGoalsSectionProps {
    userId: string;
}

const GOAL_TABS: { type: GoalType; label: string; valueLabel: string }[] = [
    { type: "SALES_QUOTA", label: "Cuota Ventas", valueLabel: "Meta venta" },
    { type: "COLLECTION_QUOTA", label: "Cuota Recaudos", valueLabel: "Meta recaudo" },
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

const formatCOP = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);

const monthLabel = (month: number) =>
    MONTHS.find((m) => m.value === month)?.label ?? String(month);

// ─── Panel de cuotas (ventas / recaudos) ───────────────────────────────────

interface GoalTabPanelProps {
    userId: string;
    type: GoalType;
    valueLabel: string;
}

const GoalTabPanel: React.FC<GoalTabPanelProps> = ({ userId, type, valueLabel }) => {
    const { showNotification } = useNotificationStore();

    const [goals, setGoals] = useState<UserGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(currentYear);
    const [value, setValue] = useState("");

    useEffect(() => {
        setLoading(true);
        getUserGoals(userId, type)
            .then(setGoals)
            .catch(() => showNotification("Error al cargar las metas", "error"))
            .finally(() => setLoading(false));
    }, [userId, type]);

    const handleAdd = async () => {
        const numValue = parseFloat(value);
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
            showNotification("Error al agregar. ¿Ya existe una meta para ese mes/año?", "error");
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
                    <Input label="" type="number" placeholder="Ej. 5500000" value={value}
                        onChange={(e) => setValue(e.target.value)} />
                </Box>
                <Button variant="primary" onClick={handleAdd} disabled={!value || isAdding}
                    isLoading={isAdding}>
                    Agregar
                </Button>
            </Box>

            {loading ? (
                <Box className="flex justify-center py-8"><CircularProgress size={28} /></Box>
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
                                <TableCell colSpan={4} align="center"
                                    sx={{ color: "text.secondary", py: 3 }}>
                                    No hay metas registradas
                                </TableCell>
                            </TableRow>
                        ) : goals.map((g) => (
                            <TableRow key={g.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                <TableCell>{monthLabel(g.month)}</TableCell>
                                <TableCell>{g.year}</TableCell>
                                <TableCell>{formatCOP(g.value)}</TableCell>
                                <TableCell padding="checkbox">
                                    <IconButton size="small" onClick={() => handleDelete(g.id)}
                                        sx={{ color: "error.light" }}>
                                        <Trash2 size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    );
};

// ─── Panel de comisiones por categoría ─────────────────────────────────────

interface CommissionTabPanelProps {
    userId: string;
}

const CommissionTabPanel: React.FC<CommissionTabPanelProps> = ({ userId }) => {
    const { showNotification } = useNotificationStore();

    const [rates, setRates] = useState<UserCommissionRate[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [categoryId, setCategoryId] = useState("");
    const [rateValue, setRateValue] = useState("");

    useEffect(() => {
        Promise.all([getUserCommissionRates(userId), getCategories()])
            .then(([fetchedRates, fetchedCategories]) => {
                setRates(fetchedRates);
                setCategories(fetchedCategories);
            })
            .catch(() => showNotification("Error al cargar las comisiones", "error"))
            .finally(() => setLoading(false));
    }, [userId]);

    const availableCategories = categories.filter(
        (c) => !rates.some((r) => r.categoryId === c.id)
    );

    const handleAdd = async () => {
        const numRate = parseFloat(rateValue);
        if (!categoryId) { showNotification("Selecciona una categoría", "warning"); return; }
        if (isNaN(numRate) || numRate < 0) {
            showNotification("El porcentaje debe ser mayor o igual a 0", "warning");
            return;
        }
        setIsAdding(true);
        try {
            const created = await createUserCommissionRate(userId, {
                categoryId,
                rate: numRate,
            });
            setRates((prev) => [...prev, created]);
            setCategoryId("");
            setRateValue("");
        } catch {
            showNotification("Error al agregar la comisión", "error");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (rateId: string) => {
        try {
            await deleteUserCommissionRate(userId, rateId);
            setRates((prev) => prev.filter((r) => r.id !== rateId));
        } catch {
            showNotification("Error al eliminar la comisión", "error");
        }
    };

    return (
        <Box className="flex flex-col gap-4 pt-4">
            <Box className="flex flex-wrap items-end gap-3">
                <Box className="flex flex-col gap-1">
                    <Typography variant="caption" color="text.secondary">Categoría</Typography>
                    <Dropdown
                        label=""
                        options={availableCategories.map((c) => ({ value: c.id, label: c.name }))}
                        value={categoryId}
                        onChange={(v) => setCategoryId(v)}
                        placeholder="Seleccionar categoría"
                        size="small"
                        minWidth={200}
                        disabled={loading}
                    />
                </Box>
                <Box className="flex flex-col gap-1 min-w-[140px]">
                    <Typography variant="caption" color="text.secondary">% de Comisión</Typography>
                    <Input label="" type="number" placeholder="Ej. 1.5" value={rateValue}
                        onChange={(e) => setRateValue(e.target.value)} />
                </Box>
                <Button variant="primary" onClick={handleAdd}
                    disabled={!categoryId || !rateValue || isAdding} isLoading={isAdding}>
                    Agregar
                </Button>
            </Box>

            {loading ? (
                <Box className="flex justify-center py-8"><CircularProgress size={28} /></Box>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>% de Comisión</TableCell>
                            <TableCell padding="checkbox" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center"
                                    sx={{ color: "text.secondary", py: 3 }}>
                                    No hay comisiones registradas
                                </TableCell>
                            </TableRow>
                        ) : rates.map((r) => (
                            <TableRow key={r.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                <TableCell>{r.categoryName}</TableCell>
                                <TableCell>{r.rate}%</TableCell>
                                <TableCell padding="checkbox">
                                    <IconButton size="small" onClick={() => handleDelete(r.id)}
                                        sx={{ color: "error.light" }}>
                                        <Trash2 size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    );
};

// ─── Sección principal con tabs ─────────────────────────────────────────────

const UserGoalsSection: React.FC<UserGoalsSectionProps> = ({ userId }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
                sx={{ borderBottom: 1, borderColor: "divider" }}>
                {GOAL_TABS.map((t) => <Tab key={t.type} label={t.label} />)}
                <Tab label="Comisión Recaudo" />
            </Tabs>

            {GOAL_TABS.map((t, i) =>
                activeTab === i ? (
                    <GoalTabPanel key={t.type} userId={userId} type={t.type}
                        valueLabel={t.valueLabel} />
                ) : null
            )}

            {activeTab === 2 && <CommissionTabPanel userId={userId} />}
        </Box>
    );
};

export default UserGoalsSection;
