import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface DetailCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

const DetailCard = ({ title, icon, children }: DetailCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
    <Box className="flex items-center gap-2 text-gray-500 mb-2">
      {icon}
      <Typography variant="overline" className="font-bold tracking-widest">
        {title}
      </Typography>
    </Box>
    
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </Box>
  </Box>
);  

export default DetailCard;
