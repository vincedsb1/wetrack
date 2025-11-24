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
    <div className="space-y-4">
      {/* Export Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Download size={18} /> Exporter
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Téléchargez une sauvegarde complète de vos rituels et historiques au
          format JSON.
        </p>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          Télécharger la sauvegarde
        </button>
      </div>

      {/* Import Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Upload size={18} /> Importer
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Restaurez une sauvegarde ou fusionnez des données depuis un autre
          appareil.
        </p>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full border-2 border-gray-900 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Sélectionner un fichier
        </button>
      </div>

      <div className="p-4 text-center text-xs text-gray-400 mt-8">
        <p>Rituels de notes v1.0</p>
        <p>Données stockées localement sur votre appareil.</p>
      </div>
    </div>
  );
}
