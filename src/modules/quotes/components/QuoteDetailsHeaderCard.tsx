import { Box, Avatar, Typography } from "@mui/material";
import { QuoteStatusBadge } from "./QuoteStatusBadge";
import { formatDate } from "../../../shared/utils/date";
import type { Quote } from "../types";

export interface QuoteHeaderCardProps {
  quote: Quote;
  clientName: string;
  initials: string;
}

const QuoteDetailsHeaderCard = ({ quote, clientName, initials }: QuoteHeaderCardProps) => {
  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <Box className="flex items-center gap-4">
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.75rem' }}>
          {initials}
        </Avatar>
        <Box className="flex flex-col gap-1.5 min-w-[150px]">
          <Typography variant="h6" className="font-bold text-gray-900 leading-none">
            {clientName}
          </Typography>
          <Box className="mt-1">
            <QuoteStatusBadge status={quote.status} />
          </Box>
        </Box>
      </Box>
      <Box className="flex flex-col sm:items-end gap-1">
        <Typography variant="body2" className="text-gray-500">
          Última actualización:<br className="sm:hidden" /> <strong className="sm:ml-1">{formatDate(quote.updatedAt)}</strong>
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Cotización:<br className="sm:hidden" /> <strong className="sm:ml-1">{quote.number}</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default QuoteDetailsHeaderCard;
