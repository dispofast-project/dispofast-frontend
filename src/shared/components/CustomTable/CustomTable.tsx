import { Box, Table, TableHead } from "@mui/material";
import type { JSX } from "react";

interface CustomTableProps<T> {
    headers: string[];
    data: T[];
    renderRow: (item: T) => (string | JSX.Element)[];
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    hidePagination?: boolean;
}

const CustomTable = <T extends {id: string | number}>(props: CustomTableProps<T>) => {
    const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);
    
    <Box component="div" className="bg-background p-4 rounded-lg shadow-md">
        <Table>
            <TableHead>
            </TableHead>
        </Table>
    </Box>
}