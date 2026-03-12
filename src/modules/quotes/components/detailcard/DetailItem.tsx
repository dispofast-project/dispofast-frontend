import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface DetailItemProps {
  label: string;
  value?: string | number | null;
  children?: ReactNode;
}

const DetailItem = ({ label, value, children }: DetailItemProps) => (
  <Box>
    <Typography 
      variant="caption" 
      className="text-gray-400 font-bold uppercase tracking-wider block mb-1"
    >
      {label}
    </Typography>
    <Typography variant="body1" className="text-gray-800 font-medium">
      {children || value || '—'}
    </Typography>
  </Box>
);  

export default DetailItem;
