import { Box, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
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

const CustomTable = <T extends {id: string | number}>(props: CustomTableProps<T>): JSX.Element => {
    const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);
    
    return (
        <Box>
            <Box component="div" className="bg-background p-4 rounded-lg shadow-md">
                <Table>
                    <TableHead>
                        <TableRow>
                            {props.headers.map((header, index) => (
                                <TableCell key={index} className="text-left px-4 py-2 border-b" sx={{ fontWeight: 'bold', fontSize: '1.1rem', justifyContent: 'center'}}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.length > 0 ? (
                            props.data.map((item, index) => (
                                <TableRow key={index} className="border-b">
                                    {props.renderRow(item).map((cell, cellIndex) => (
                                        <TableCell key={cellIndex} className="px-4 py-2">
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={props.headers.length} className="text-center py-4">
                                    No hay datos disponibles.
                                </TableCell>
                            </TableRow>
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
    );
}

export default CustomTable;