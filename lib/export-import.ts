import type { ExportData, Ritual } from "./types";

/**
 * Merge logic for import without data loss
 * Based on spec 6.2 Import avec fusion
 */

export const mergeRituals = (currentRituals: Ritual[], importedRituals: Ritual[]): Ritual[] => {
  const mergedRituals: Ritual[] = [];

  for (const importedR of importedRituals) {
    const localR = currentRituals.find((r) => r.id === importedR.id);

    if (!localR) {
      // New ritual from import
      mergedRituals.push(importedR);
    } else {
      // Merge existing ritual

      // 1. Union Participants by id
      const mergedParticipants = [...localR.participants];
      importedR.participants.forEach((ip) => {
        if (!mergedParticipants.find((lp) => lp.id === ip.id)) {
          mergedParticipants.push(ip);
        }
      });

      // 2. Union Questions by id, keep imported order if collision
      const mergedQuestions = [...localR.questions];
      importedR.questions.forEach((iq) => {
        if (!mergedQuestions.find((lq) => lq.id === iq.id)) {
          mergedQuestions.push(iq);
        }
      });
      // Sort by order
      mergedQuestions.sort((a, b) => a.order - b.order);

      // 3. Union Entries by id, ignore if collision
      const mergedEntries = [...localR.entries];
      importedR.entries.forEach((ie) => {
        if (!mergedEntries.find((le) => le.id === ie.id)) {
          mergedEntries.push(ie);
        }
      });
      // Sort by date
      mergedEntries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      // 4. Recalc updatedAt: max(local, imported)
      const localUpdateDate = new Date(localR.updatedAt);
      const importedUpdateDate = new Date(importedR.updatedAt);
      const updatedAt =
        importedUpdateDate > localUpdateDate
          ? importedR.updatedAt
          : localR.updatedAt;

      mergedRituals.push({
        ...localR,
        title: localR.title, // Prefer local title
        participants: mergedParticipants,
        questions: mergedQuestions,
        entries: mergedEntries,
        updatedAt,
      });
    }
  }

  // Keep non-imported rituals
  currentRituals.forEach((r) => {
    if (!mergedRituals.find((mr) => mr.id === r.id)) {
      mergedRituals.push(r);
    }
  });

  return mergedRituals;
};

export const generateExportData = (rituals: Ritual[]): ExportData => {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    rituals,
  };
};

export const downloadExport = (data: ExportData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rituels_backup_${data.exportedAt.split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const validateImportFile = (json: unknown): json is ExportData => {
  const data = json as Record<string, unknown>;
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray(data.rituals) &&
    data.version === 1
  );
};
