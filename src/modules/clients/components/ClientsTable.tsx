import { Box } from "@mui/material";
import type { ClientPreview } from "../types";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import { CLIENT_STATUS_CONFIG } from "../config/statusConfig";

interface ClientsTableProps {
  clients: ClientPreview[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowClick: (client: ClientPreview) => void;
}

const ClientsTable = ({
  clients,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onRowClick,
}: ClientsTableProps) => {
  const headers = [
    "Cliente",
    "NIT",
    "Tipo de cliente",
    "Estado",
    "Asesor",
    "Ciudad",
  ];

  const renderRow = (client: ClientPreview) => {
    return [
      <span key={`name-${client.id}`} className="font-medium text-gray-900">
        {client.name}
      </span>,
      <span key={`id-${client.id}`}>{client.identificationNumber}</span>,
      <span key={`type-${client.id}`}>
        {client.legalEntityType === "natural" ? "Persona natural" : "Empresa"}/{client.clientType}
      </span>,
      <StatusBadge
        key={`status-${client.id}`}
        status={client.isActive}
        configMap={CLIENT_STATUS_CONFIG}
      />,
      <span key={`advisor-${client.id}`}>
        {client.defaultAdvisor?.fullName || "-"}
      </span>,
      <span key={`city-${client.id}`}>
        {client.city?.name || "-"}
      </span>,
    ];
  };

  return (
    <Box className="w-full">
      <CustomTable
        headers={headers}
        data={clients}
        renderRow={renderRow}
        onRowClick={onRowClick}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </Box>
  );
};

export default ClientsTable;
