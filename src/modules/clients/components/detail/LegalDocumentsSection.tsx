import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

import type { LegalDocument } from "../../types";
import {
  deleteLegalDocumentService,
  downloadLegalDocumentService,
  getLegalDocumentsService,
  uploadLegalDocumentService,
} from "../../api/clients.api";
import SectionCard from "./SectionCard";
import LegalDocumentUploadZone, { type DocumentItem } from "../LegalDocumentUploadZone";

interface LegalDocumentsSectionProps {
  clientId: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const LegalDocumentsSection = ({ clientId }: LegalDocumentsSectionProps) => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLegalDocumentsService(clientId)
      .then(setDocuments)
      .catch(() => setError("Error al cargar los documentos."))
      .finally(() => setIsLoading(false));
  }, [clientId]);

  const handleAdd = async (files: File[]) => {
    setIsUploading(true);
    setError(null);
    try {
      for (const file of files) {
        const newDoc = await uploadLegalDocumentService(clientId, file);
        setDocuments((prev) => [...prev, newDoc]);
      }
    } catch {
      setError("Error al subir el documento. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
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

  const items: DocumentItem[] = documents.map((doc) => ({
    key: doc.id,
    name: doc.fileAttachment?.filename ?? "Archivo sin nombre",
    meta: [
      doc.fileAttachment?.fileSize
        ? formatFileSize(doc.fileAttachment.fileSize)
        : undefined,
      formatDate(doc.createdAt),
    ]
      .filter(Boolean)
      .join(" · "),
    isDeleting: deletingId === doc.id,
    isDownloading: downloadingId === doc.id,
    onDelete: () => handleDelete(doc.id),
    onDownload: () => handleDownload(doc.id),
  }));

  return (
    <SectionCard title="Documentos Legales" icon={<DescriptionIcon fontSize="small" />}>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <CircularProgress size={24} />
        </div>
      ) : (
        <>
          {documents.length === 0 && !isUploading && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2 mb-3">
              <DescriptionIcon sx={{ fontSize: 36, opacity: 0.4 }} />
              <p className="text-sm">Sin documentos adjuntos</p>
            </div>
          )}

          <LegalDocumentUploadZone
            items={items}
            onAdd={handleAdd}
            isUploading={isUploading}
          />
        </>
      )}
    </SectionCard>
  );
};

export default LegalDocumentsSection;
