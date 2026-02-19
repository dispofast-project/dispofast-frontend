import { Box, Pagination, Table, TableBody, TableCell, TableHead } from "@mui/material";
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
    
    <Box>
        <Box component="div" className="bg-background p-4 rounded-lg shadow-md">
            <Table>
                <TableHead>
                    {props.headers.map((header, index) => (
                        <Box component="th" key={index} className="text-left px-4 py-2 border-b">
                            {header}
                        </Box>
                    ))}
                </TableHead>
                <TableBody>
                    {props.data.length > 0 ? (
                        props.data.map((item, index) => (
                        <TableCell key={index} className="border-b">
                            {props.renderRow(item).map((cell, cellIndex) => (
                                <Box component="td" key={cellIndex} className="px-4 py-2">
                                    {cell}
                                </Box>
                            ))}
                        </TableCell>
                    ))
                    ) : (
                        <Box component="tr">
                            <Box component="td" colSpan={props.headers.length} className="text-center py-4">
                                No hay datos disponibles.
                            </Box>
                        </Box>
                    )}

                    
                </TableBody>
            </Table>
        </Box>
            {!props.hidePagination && totalPages > 1 && (
                <Box className="flex justify-center mt-4">
                    <Pagination
                        count={totalPages}
                        page={props.currentPage}
                        onChange={(_, page) => props.onPageChange(page)}
                    />
                </Box>
            )}
    </Box>
    


}

export default CustomTable;