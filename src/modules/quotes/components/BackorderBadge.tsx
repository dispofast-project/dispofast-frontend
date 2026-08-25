import { PackageX } from "lucide-react";

interface BackorderBadgeProps {
  backorder?: boolean;
}

export const BackorderBadge = ({ backorder }: BackorderBadgeProps) => {
  if (!backorder) return null;

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-purple-100 text-purple-800 border-purple-200">
      <PackageX size={14} className="mr-1.5" />
      Backorder
    </span>
  );
};
