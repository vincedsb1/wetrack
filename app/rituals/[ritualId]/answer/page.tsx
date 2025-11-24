"use client";

import { useRouter, useParams } from "next/navigation";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import { AnswerWizard } from "@/features/wizard/components/AnswerWizard";
import type { Entry } from "@/lib/types";

export default function AnswerPage() {
  const params = useParams();
  const router = useRouter();
  const ritualId = params.ritualId as string;

  const { getRitualById, addEntry, loading } = useRitualsStore();
  const { notify } = useUIStore();

  const ritual = getRitualById(ritualId);

  if (!ritual) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}>
        Rituel non trouvé
      </div>
    );
  }

  const handleCancel = () => {
    router.back();
  };

  const handleFinish = async (entry: Entry) => {
    try {
      await addEntry(ritual.id, entry);
      notify("Entrée enregistrée avec succès !", "success");
      router.push(`/rituals/${ritual.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors de l'enregistrement";
      notify(message, "error");
    }
  };

  return (
    <AnswerWizard
      ritual={ritual}
      onCancel={handleCancel}
      onFinish={handleFinish}
      isLoading={loading}
    />
  );
}
