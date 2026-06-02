import { useRef, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { ImageIcon, Upload, X } from "lucide-react";

interface ProductImageUploadProps {
  currentImageUrl?: string;
  imageFile?: File | null;
  onFileSelect: (file: File) => void;
  onFileClear?: () => void;
  disabled?: boolean;
  error?: string;
}

const ProductImageUpload = ({
  currentImageUrl,
  imageFile,
  onFileSelect,
  onFileClear,
  disabled = false,
  error,
}: ProductImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    setImgError(false);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    setImgError(false);
  }, [currentImageUrl]);

  const displayUrl = previewUrl ?? (imgError ? null : currentImageUrl);
  const hasImage = !!displayUrl;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileClear?.();
  };

  if (hasImage) {
    return (
      <Box className="flex flex-col gap-1">
        <p className="text-xs font-medium text-gray-600">Imagen del producto</p>
        <Box
          className="relative rounded-lg overflow-hidden border border-gray-200"
          sx={{ height: 200 }}
        >
          <img
            src={displayUrl!}
            alt="Imagen del producto"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {!disabled && (
            <Box className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center gap-2 group">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow"
              >
                <Upload size={13} />
                Cambiar
              </button>
              {onFileClear && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow"
                >
                  <X size={13} />
                  Quitar
                </button>
              )}
            </Box>
          )}
        </Box>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-600">Imagen del producto</p>
      <Box
        component={disabled ? "div" : "button"}
        type={disabled ? undefined : "button"}
        onClick={disabled ? undefined : () => inputRef.current?.click()}
        onDragOver={disabled ? undefined : (e: React.DragEvent) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={disabled ? undefined : () => setDragging(false)}
        onDrop={disabled ? undefined : handleDrop}
        className={[
          "w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors",
          disabled
            ? "border-gray-200 bg-gray-50 cursor-default"
            : dragging
            ? "border-blue-400 bg-blue-50 cursor-pointer"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer",
        ].join(" ")}
        sx={{ height: 160 }}
      >
        <Box className={`p-3 rounded-full ${disabled ? "bg-gray-100" : "bg-gray-100"}`}>
          <ImageIcon size={24} className="text-gray-400" />
        </Box>
        {!disabled && (
          <>
            <p className="text-sm font-medium text-gray-600">Subir imagen</p>
            <p className="text-xs text-gray-400">Arrastra o haz clic para seleccionar</p>
          </>
        )}
        {disabled && <p className="text-xs text-gray-400">Sin imagen</p>}
      </Box>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!disabled && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      )}
    </Box>
  );
};

export default ProductImageUpload;
