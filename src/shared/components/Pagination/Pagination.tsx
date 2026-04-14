import { Box } from "@mui/material";

export interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
    const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);

    if (totalPages <= 1) return null;

    const startItem = (props.currentPage - 1) * props.itemsPerPage + 1;
    const endItem = Math.min(props.currentPage * props.itemsPerPage, props.totalItems);

    return (

        <Box className="flex items-center justify-between mt-4">
            <p>
                Mostrando {startItem} - {endItem} de {props.totalItems} resultados
            </p>

            <Box component="div" className="flex justify-end mt-4">
                <button
                    onClick={() => props.onPageChange(props.currentPage - 1)}
                    disabled={props.currentPage === 1}
                    className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => props.onPageChange(i + 1)}
                        className={`px-3 py-1 mx-1 rounded ${props.currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => props.onPageChange(props.currentPage + 1)}
                    disabled={props.currentPage === totalPages}
                    className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </Box>
        </Box>
        
    );
}

export default Pagination;