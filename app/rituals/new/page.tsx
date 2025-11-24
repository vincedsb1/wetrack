"use client";

import { useRouter } from "next/navigation";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import { CreateRitualForm } from "@/features/rituals/components/CreateRitualForm";
import type { Ritual } from "@/lib/types";

export default function CreateRitualPage() {
  const router = useRouter();
  const { createRitual, loading } = useRitualsStore();
  const { notify } = useUIStore();

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async (ritual: Ritual) => {
    try {
      await createRitual(ritual);
      notify("Rituel créé !", "success");
      router.push(`/rituals/${ritual.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors de la création";
      notify(message, "error");
    }
  };

  return (
    <CreateRitualForm
      onCancel={handleCancel}
      onSave={handleSave}
      isLoading={loading}
    />
  );
}
