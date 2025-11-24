"use client";

import { useRouter } from "next/navigation";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import { ExportImportPanel } from "@/features/settings/components/ExportImportPanel";
import { generateExportData, downloadExport, validateImportFile } from "@/lib/export-import";
import { Header } from "@/features/layout/components/Header";
import type { ExportData } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const { rituals, loading, importRituals } = useRitualsStore();
  const { notify } = useUIStore();

  const handleExport = (data: ExportData) => {
    try {
      downloadExport(data);
      notify("Sauvegarde téléchargée !", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'export";
      notify(message, "error");
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!validateImportFile(json)) {
        throw new Error("Format invalide");
      }

      await importRituals(json.rituals);
      notify("Import réussi avec fusion !", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'import";
      notify(message, "error");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      maxWidth: "448px",
      margin: "0 auto",
    }}>
      {/* Header */}
      <Header showSettings={false} />

      {/* Title */}
      <div
        style={{
          padding: "24px 16px",
          backgroundColor: "#f3f4f6",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: 0,
            color: "#111827",
          }}
        >
          Paramètres & Données
        </h2>
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <ExportImportPanel
          rituals={rituals}
          onExport={handleExport}
          onImport={handleImport}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
