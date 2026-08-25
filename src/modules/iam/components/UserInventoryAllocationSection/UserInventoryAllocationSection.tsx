import { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import { ProductAutocomplete } from "../../../../shared/components/ProductAutocomplete/ProductAutocomplete";
import type { InventoryItem } from "../../../inventory/api/inventory.service";
import {
    createUserInventoryAllocation,
    deleteUserInventoryAllocation,
    getUserInventoryAllocations,
    updateUserInventoryAllocation,
} from "../../api/user.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { UserProductAllocation } from "../../types";

interface UserInventoryAllocationSectionProps {
    userId: string;
}

const UserInventoryAllocationSection: React.FC<UserInventoryAllocationSectionProps> = ({
    userId,
}) => {
    const { showNotification } = useNotificationStore();

    const [allocations, setAllocations] = useState<UserProductAllocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
    const [quantityValue, setQuantityValue] = useState("");

    const [pendingQuantity, setPendingQuantity] = useState<Record<string, string>>({});

    useEffect(() => {
        setLoading(true);
        getUserInventoryAllocations(userId)
            .then((fetched) => {
                setAllocations(fetched);
                const initial: Record<string, string> = {};
                fetched.forEach((a) => { initial[a.id] = String(a.assignedQuantity); });
                setPendingQuantity(initial);
            })
            .catch(() => showNotification("Error al cargar los cupos de inventario", "error"))
            .finally(() => setLoading(false));
    }, [userId]);

    const handleAdd = async () => {
        const numQuantity = parseInt(quantityValue, 10);
        if (!selectedProduct) { showNotification("Selecciona un producto", "warning"); return; }
        if (isNaN(numQuantity) || numQuantity < 0) {
            showNotification("El cupo debe ser mayor o igual a 0", "warning");
            return;
        }
        setIsAdding(true);
        try {
            const created = await createUserInventoryAllocation(userId, {
                productId: selectedProduct.productId,
                assignedQuantity: numQuantity,
            });
            setAllocations((prev) => [...prev, created]);
            setPendingQuantity((prev) => ({ ...prev, [created.id]: String(created.assignedQuantity) }));
            setSelectedProduct(null);
            setQuantityValue("");
        } catch {
            showNotification("Error al agregar el cupo. ¿Ya existe uno para ese producto?", "error");
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdateQuantity = async (allocation: UserProductAllocation) => {
        const newValue = parseInt(pendingQuantity[allocation.id] ?? String(allocation.assignedQuantity), 10);
        if (isNaN(newValue) || newValue < 0 || newValue === allocation.assignedQuantity) return;
        try {
            const updated = await updateUserInventoryAllocation(userId, allocation.id, {
                assignedQuantity: newValue,
            });
            setAllocations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        } catch {
            showNotification("Error al actualizar el cupo", "error");
            setPendingQuantity((prev) => ({ ...prev, [allocation.id]: String(allocation.assignedQuantity) }));
        }
    };

    const handleDelete = async (allocationId: string) => {
        try {
            await deleteUserInventoryAllocation(userId, allocationId);
            setAllocations((prev) => prev.filter((a) => a.id !== allocationId));
        } catch {
            showNotification("Error al eliminar el cupo", "error");
        }
    };

    return (
        <Box className="flex flex-col gap-4 pt-4">
            <Box className="flex flex-wrap items-end gap-3">
                <Box className="flex flex-col gap-1 min-w-[260px]">
                    <Typography variant="caption" color="text.secondary">Producto</Typography>
                    <ProductAutocomplete value={selectedProduct} onChange={setSelectedProduct} label="" />
                </Box>
                <Box className="flex flex-col gap-1 min-w-[140px]">
                    <Typography variant="caption" color="text.secondary">Cupo asignado</Typography>
                    <TextField
                        size="small"
                        type="number"
                        placeholder="Ej. 50"
                        value={quantityValue}
                        onChange={(e) => setQuantityValue(e.target.value)}
                        slotProps={{ htmlInput: { min: 0, step: 1 } }}
                    />
                </Box>
                <Button variant="primary" onClick={handleAdd}
                    disabled={!selectedProduct || !quantityValue || isAdding} isLoading={isAdding}>
                    Agregar
                </Button>
            </Box>

            {loading ? (
                <Box className="flex justify-center py-8"><CircularProgress size={28} /></Box>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Cupo asignado</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Consumido</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Restante</TableCell>
                            <TableCell padding="checkbox" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allocations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center"
                                    sx={{ color: "text.secondary", py: 3 }}>
                                    No hay cupos de inventario asignados
                                </TableCell>
                            </TableRow>
                        ) : allocations.map((a) => (
                            <TableRow key={a.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                <TableCell>
                                    <Typography variant="body2">{a.productName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{a.productSku}</Typography>
                                </TableCell>
                                <TableCell sx={{ width: 120 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={pendingQuantity[a.id] ?? String(a.assignedQuantity)}
                                        onChange={(e) =>
                                            setPendingQuantity((prev) => ({ ...prev, [a.id]: e.target.value }))
                                        }
                                        onBlur={() => handleUpdateQuantity(a)}
                                        slotProps={{ htmlInput: { min: 0, step: 1, style: { width: 70 } } }}
                                    />
                                </TableCell>
                                <TableCell>{a.consumedQuantity}</TableCell>
                                <TableCell>{a.remainingQuantity}</TableCell>
                                <TableCell padding="checkbox">
                                    <IconButton size="small" onClick={() => handleDelete(a.id)}
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

export default UserInventoryAllocationSection;
