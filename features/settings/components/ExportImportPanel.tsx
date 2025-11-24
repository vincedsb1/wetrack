"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import type { Ritual, ExportData } from "@/lib/types";

interface ExportImportPanelProps {
  rituals: Ritual[];
  onExport: (data: ExportData) => void;
  onImport: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function ExportImportPanel({
  rituals,
  onExport,
  onImport,
  isLoading = false,
}: ExportImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      rituals,
    };
    onExport(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Export Section */}
      <div style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
      }}>
        <h3 style={{
          fontWeight: "bold",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: 0,
          color: "#111827",
        }}>
          <Download size={18} /> Exporter
        </h3>
        <p style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "16px",
          margin: "8px 0 16px 0",
        }}>
          Téléchargez une sauvegarde complète de vos rituels et historiques au
          format JSON.
        </p>
        <button
          onClick={handleExport}
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: "#111827",
            color: "white",
            padding: "8px",
            borderRadius: "8px",
            fontWeight: "500",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
            transition: "background-color 0.2s",
          }}
        >
          Télécharger la sauvegarde
        </button>
      </div>

      {/* Import Section */}
      <div style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
      }}>
        <h3 style={{
          fontWeight: "bold",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: 0,
          color: "#111827",
        }}>
          <Upload size={18} /> Importer
        </h3>
        <p style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "16px",
          margin: "8px 0 16px 0",
        }}>
          Restaurez une sauvegarde ou fusionnez des données depuis un autre
          appareil.
        </p>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          style={{
            width: "100%",
            borderTop: "2px solid #111827",
            borderRight: "2px solid #111827",
            borderBottom: "2px solid #111827",
            borderLeft: "2px solid #111827",
            color: "#111827",
            padding: "8px",
            borderRadius: "8px",
            fontWeight: "500",
            backgroundColor: "white",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
            transition: "background-color 0.2s",
          }}
        >
          Sélectionner un fichier
        </button>
      </div>

      <div style={{
        padding: "16px",
        textAlign: "center",
        fontSize: "12px",
        color: "#9ca3af",
        marginTop: "32px",
      }}>
        <p style={{ margin: "0 0 4px 0" }}>WeTrack v1.0</p>
        <p style={{ margin: 0 }}>Données stockées localement sur votre appareil.</p>
      </div>
    </div>
  );
}
