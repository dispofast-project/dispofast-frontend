import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface DetailSectionProps {
  title?: string;
  children: ReactNode;
}

const DetailSection = ({ title, children }: DetailSectionProps) => (
  <>
    {title && (
      <Box className="col-span-1 md:col-span-2 mt-4 mb-2">
        <Typography 
          variant="subtitle2" 
          className="text-gray-700 font-bold border-b pb-1"
        >
          {title}
        </Typography>
      </Box>
    )}
    {children}
  </>
);

export default DetailSection;