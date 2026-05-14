interface StockBarProps {
  available: number;
  reserved: number;
}

const StockBar = ({ available, reserved }: StockBarProps) => {
  const total = available + reserved;

  if (total === 0) {
    return <div className="w-24 h-2 bg-gray-200 rounded-full" />;
  }

  const availableWidth = Math.round((available / total) * 100);
  const reservedWidth = 100 - availableWidth;

  return (
    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden flex">
      <div className="h-full bg-blue-600" style={{ width: `${availableWidth}%` }} />
      <div className="h-full bg-blue-300" style={{ width: `${reservedWidth}%` }} />
    </div>
  );
};

export default StockBar;
