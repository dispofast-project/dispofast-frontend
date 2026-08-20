import { Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionTitleProps {
  icon?: ReactNode;
  children: ReactNode;
}

const SectionTitle = ({ icon, children }: SectionTitleProps) => (
  <Typography
    variant="overline"
    className="text-gray-500 font-bold tracking-widest mb-4 flex items-center gap-1.5"
    component="div"
  >
    {icon}
    {children}
  </Typography>
);

export default SectionTitle;
