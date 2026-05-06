import { useEffect, useRef, useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import type { LegalDocument } from "../../types";
import {
  deleteLegalDocumentService,
  downloadLegalDocumentService,
  getLegalDocumentsService,
  uploadLegalDocumentService,
} from "../../api/clients.api";
import SectionCard from "./SectionCard";

interface LegalDocumentsSectionProps {
  clientId: string;
}

const LegalDocumentsSection = ({ clientId }: LegalDocumentsSectionProps) => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getLegalDocumentsService(clientId);
        setDocuments(docs);
      } catch {
        setError("Error al cargar los documentos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const newDoc = await uploadLegalDocumentService(clientId, file);
      setDocuments((prev) => [...prev, newDoc]);
    } catch {
      setError("Error al subir el documento. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
      // Limpiar el input para permitir subir el mismo archivo nuevamente
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (docId: string) => {
    setDeletingId(docId);
    setError(null);
    try {
      await deleteLegalDocumentService(clientId, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      setError("Error al eliminar el documento.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (docId: string) => {
    setDownloadingId(docId);
    setError(null);
    try {
      const doc = documents.find((d) => d.id === docId);
      await downloadLegalDocumentService(clientId, docId, doc?.fileAttachment?.filename);
    } catch {
      setError("Error al descargar el documento.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <SectionCard
      title="Documentos Legales"
      icon={<DescriptionIcon fontSize="small" />}
    >
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Error global */}
      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}

      {/* Estado de carga inicial */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <CircularProgress size={24} />
        </div>
      ) : (
        <>
          {/* Lista de documentos */}
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
              <DescriptionIcon sx={{ fontSize: 36, opacity: 0.4 }} />
              <p className="text-sm">Sin documentos adjuntos</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2 mb-4">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {/* Info del archivo */}
                  <div className="flex items-center gap-2 min-w-0">
                    <DescriptionIcon
                      fontSize="small"
                      className="text-gray-400 shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium text-gray-700 truncate"
                        title={doc.fileAttachment?.filename}
                      >
                        {doc.fileAttachment?.filename ?? "Archivo sin nombre"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {doc.fileAttachment?.fileSize
                          ? `${formatFileSize(doc.fileAttachment.fileSize)} · `
                          : ""}
                        {formatDate(doc.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Tooltip title="Descargar">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(doc.id)}
                          disabled={downloadingId === doc.id || deletingId === doc.id}
                        >
                          {downloadingId === doc.id ? (
                            <CircularProgress size={14} />
                          ) : (
                            <DownloadIcon fontSize="small" className="text-gray-500" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(doc.id)}
                          disabled={deletingId === doc.id || downloadingId === doc.id}
                        >
                          {deletingId === doc.id ? (
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
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Botón subir */}
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <CircularProgress size={14} />
                Subiendo...
              </>
            ) : (
              <>
                <UploadFileIcon fontSize="small" />
                Subir documento
              </>
            )}
          </button>
        </>
      )}
    </SectionCard>
  );
};

export default LegalDocumentsSection;
