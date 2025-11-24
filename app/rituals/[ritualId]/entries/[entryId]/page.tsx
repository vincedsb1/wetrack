"use client";

import { useRouter, useParams } from "next/navigation";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import { EntryDetailTable } from "@/features/entries/components/EntryDetailTable";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ritualId = params.ritualId as string;
  const entryId = params.entryId as string;

  const { getRitualById, deleteEntry, loading } = useRitualsStore();
  const { notify } = useUIStore();

  const ritual = getRitualById(ritualId);
  const entry = ritual?.entries.find((e) => e.id === entryId);

  if (!ritual || !entry) {
    return (
      <div className="flex items-center justify-center h-screen">
        Entrée non trouvée
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm("Supprimer cette entrée ?")) return;

    try {
      await deleteEntry(ritual.id, entry.id);
      notify("Entrée supprimée", "success");
      router.push(`/rituals/${ritual.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors de la suppression";
      notify(message, "error");
    }
  };

  return (
    <EntryDetailTable
      ritual={ritual}
      entry={entry}
      onDelete={handleDelete}
      isLoading={loading}
    />
  );
}
