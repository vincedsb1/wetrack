"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import { ExportImportPanel } from "@/features/settings/components/ExportImportPanel";
import { generateExportData, downloadExport, validateImportFile } from "@/lib/export-import";
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
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="bg-white p-2 rounded-full shadow-sm mr-4"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-bold">Paramètres & Données</h2>
      </div>

      <ExportImportPanel
        rituals={rituals}
        onExport={handleExport}
        onImport={handleImport}
        isLoading={loading}
      />
    </div>
  );
}
