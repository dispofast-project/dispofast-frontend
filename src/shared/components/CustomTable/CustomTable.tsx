import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { JSX } from "react";

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
}

const CustomTable = <T extends { id: string | number }>({
  headers,
  data,
  renderRow,
  onRowClick,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  hidePagination = false,
}: CustomTableProps<T>) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Box>
      <Box className="bg-background p-4 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={`head-${index}`} sx={{ fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => onRowClick?.(item)}
                  sx={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {renderRow(item).map((cell, cellIndex) => (
                    <TableCell key={`${item.id}-cell-${cellIndex}`}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  align="center"
                  sx={{ py: 4 }}
                >
                  No hay datos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {!hidePagination && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default CustomTable;
