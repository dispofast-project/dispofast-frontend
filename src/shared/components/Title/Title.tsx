import { Box, Typography } from "@mui/material";
import type React from "react";

export interface Breadcrumb{
    label: string;
    onClick?: () => void;
}

interface TitleProps {
    mainTitle?: string;
    description?: string;
}

const CustomTitle: React.FC<TitleProps> = ({ mainTitle, description }) => {
    return (
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800">
            {mainTitle}
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            {description}
          </Typography>
        </Box>
    );
}

export default CustomTitle;