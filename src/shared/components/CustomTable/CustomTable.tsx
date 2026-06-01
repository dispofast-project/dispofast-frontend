import { Box, IconButton, Menu, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { MoreVerticalIcon } from "lucide-react";
import { useState, type ReactNode, type JSX } from "react";

interface CustomTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => (string | JSX.Element)[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  hidePagination?: boolean;
  optionsMenu?: (item: T, closeMenu: () => void) => ReactNode;
}

const CustomTable = <T extends {id: string | number}>(props: CustomTableProps<T>): JSX.Element => {
    const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeItem, setActiveItem] = useState<T | null>(null);

    const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>, item: T) => {
        event.stopPropagation(); 
        setAnchorEl(event.currentTarget);
        setActiveItem(item);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }
    
    return (
        <Box>
            <Box component="div" className="bg-background p-4 rounded-lg shadow-md">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="none">
                            </TableCell>
                            {props.headers.map((header, index) => (
                                <TableCell key={index} className="text-left px-3 py-2 border-b" sx={{ fontWeight: 'bold', fontSize: '1.1rem', justifyContent: 'center'}}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.length > 0 ? (
                            props.data.map((item, index) => (
                                
                                <TableRow
                                    key={index}
                                    className="border-b"
                                    onClick={() => props.onRowClick?.(item)}
                                    sx={props.onRowClick ? { cursor: "pointer", "&:hover": { backgroundColor: "action.hover" } } : undefined}
                                >
                                    <TableCell>
                                        {props.optionsMenu && (
                                            <IconButton
                                                aria-label="opciones"
                                                id={`options-button-${item.id}`}
                                                aria-controls={Boolean(anchorEl) && activeItem?.id === item.id ? `options-menu-${item.id}` : undefined}
                                                aria-haspopup="true"
                                                onClick={(e) => handleOptionsClick(e, item)} 
                                            >
                                                <MoreVerticalIcon/>
                                            </IconButton>
                                        )}
                                    </TableCell>

                                    {props.renderRow(item).map((cell, cellIndex) => (
                                        <TableCell key={cellIndex} className="px-4 py-2">
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={props.headers.length + 1} className="text-center py-4">
                                    No hay datos disponibles.
                                </TableCell>
                            </TableRow>
                        )}

                        
                    </TableBody>
                </Table>

                {props.optionsMenu && (
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        {activeItem && props.optionsMenu(activeItem, handleCloseMenu)}
                    </Menu>
                )}
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
