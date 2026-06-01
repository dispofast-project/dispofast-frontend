import { useRef } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export interface DocumentItem {
  key: string;
  name: string;
  meta?: string;
  onDelete?: () => void;
  onDownload?: () => void;
  isDeleting?: boolean;
  isDownloading?: boolean;
}

interface LegalDocumentUploadZoneProps {
  items: DocumentItem[];
  onAdd: (files: File[]) => void;
  isUploading?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const LegalDocumentUploadZone = ({
  items,
  onAdd,
  isUploading = false,
  error = false,
  errorMessage,
}: LegalDocumentUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAdd(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {items.length > 0 && (
        <ul className="flex flex-col gap-2 mb-3">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <DescriptionIcon fontSize="small" className="text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium text-gray-700 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  {item.meta && (
                    <p className="text-xs text-gray-400">{item.meta}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                {item.onDownload && (
                  <Tooltip title="Descargar">
                    <span>
                      <IconButton
                        size="small"
                        onClick={item.onDownload}
                        disabled={item.isDownloading || item.isDeleting}
                      >
                        {item.isDownloading ? (
                          <CircularProgress size={14} />
                        ) : (
                          <DownloadIcon fontSize="small" className="text-gray-500" />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}

                {item.onDelete && (
                  <Tooltip title="Eliminar">
                    <span>
                      <IconButton
                        size="small"
                        onClick={item.onDelete}
                        disabled={item.isDeleting || item.isDownloading}
                      >
                        {item.isDeleting ? (
                          <CircularProgress size={14} />
                        ) : (
                          <DeleteOutlineIcon
                            fontSize="small"
                            className="text-red-400 hover:text-red-600"
                          />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          error && items.length === 0
            ? "border-red-400 text-red-500 bg-red-50 hover:bg-red-100"
            : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        {isUploading ? (
          <>
            <CircularProgress size={14} />
            Subiendo...
          </>
        ) : (
          <>
            <UploadFileIcon fontSize="small" />
            {items.length === 0 ? "Adjuntar documento(s)" : "Agregar más documentos"}
          </>
        )}
      </button>

      {error && items.length === 0 && errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </>
  );
};

export default LegalDocumentUploadZone;
