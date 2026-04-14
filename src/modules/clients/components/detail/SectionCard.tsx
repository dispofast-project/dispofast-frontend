import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard = ({ title, icon, children }: SectionCardProps) => {
  return (
    <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Box className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2">
        {icon && (
          <Box className="text-gray-500 flex items-center">
            {icon}
          </Box>
        )}
        <Typography variant="h6" className="font-semibold text-gray-800">
          {title}
        </Typography>
      </Box>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
