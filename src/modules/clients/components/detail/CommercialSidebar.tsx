import { Box, Card, CardContent, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaymentsIcon from "@mui/icons-material/Payments";
import type { ClientResponse } from "../../types";

interface CommercialSidebarProps {
  client: ClientResponse;
}

const CommercialSidebar = ({ client }: CommercialSidebarProps) => {
  return (
    <Box>
      <Typography variant="h6" className="font-bold text-gray-800 mb-4 px-1">
        Información Comercial
      </Typography>

      <Box className="space-y-3">
        {/* Tipo de Cliente */}
        <Card className="shadow-sm border border-blue-50 bg-blue-50/50 rounded-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <Box className="p-2 bg-blue-100 rounded-lg flex items-center justify-center">
              <StorefrontIcon className="text-blue-600" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                className="text-gray-500 uppercase font-semibold block"
              >
                Tipo de Cliente
              </Typography>
              <Typography variant="body1" className="text-gray-900 font-bold">
                {client.clientType?.name || "Sin Clasificar"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Descuento Base */}
        <Card className="shadow-sm border border-emerald-50 bg-emerald-50/50 rounded-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <Box className="p-2 bg-emerald-100 rounded-lg flex items-center justify-center">
              <LocalOfferIcon className="text-emerald-600" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                className="text-gray-500 uppercase font-semibold block"
              >
                Descuento Base
              </Typography>
              <Typography variant="h6" className="text-gray-900 font-bold leading-tight">
                {client.defaultDiscountRate}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Lista de Precios */}
        <Card className="shadow-sm border border-purple-50 bg-purple-50/50 rounded-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <Box className="p-2 bg-purple-100 rounded-lg flex items-center justify-center">
              <PaymentsIcon className="text-purple-600" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                className="text-gray-500 uppercase font-semibold block"
              >
                Lista de Precios
              </Typography>
              <Typography variant="body1" className="text-gray-900 font-bold">
                {client.priceList?.name || "Lista Estándar"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CommercialSidebar;
