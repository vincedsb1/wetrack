"use client";

import { create } from "zustand";
import type { Ritual, Entry, Participant, Question, Response } from "@/lib/types";
import { DB } from "@/lib/db";
import { mergeRituals } from "@/lib/export-import";

interface RitualsState {
  rituals: Ritual[];
  loading: boolean;
  error: string | null;

  // Actions
  loadRituals: () => Promise<void>;
  createRitual: (ritual: Ritual) => Promise<void>;
  deleteRitual: (id: string) => Promise<void>;
  addEntry: (ritualId: string, entry: Entry) => Promise<void>;
  deleteEntry: (ritualId: string, entryId: string) => Promise<void>;
  importRituals: (newRituals: Ritual[]) => Promise<void>;
  getRitualById: (id: string) => Ritual | undefined;
}

export const useRitualsStore = create<RitualsState>((set, get) => ({
  rituals: [],
  loading: true,
  error: null,

  loadRituals: async () => {
    try {
      set({ loading: true, error: null });
      const data = await DB.getAll();
      // Sort by updatedAt descending
      data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      set({ rituals: data, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de chargement";
      set({ error: message, loading: false });
    }
  },

  createRitual: async (ritual: Ritual) => {
    try {
      await DB.save(ritual);
      const updated = [...get().rituals, ritual];
      updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      set({ rituals: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création";
      set({ error: message });
      throw err;
    }
  },

  deleteRitual: async (id: string) => {
    try {
      await DB.delete(id);
      set({ rituals: get().rituals.filter((r) => r.id !== id) });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      set({ error: message });
      throw err;
    }
  },

  addEntry: async (ritualId: string, entry: Entry) => {
    try {
      const ritual = get().rituals.find((r) => r.id === ritualId);
      if (!ritual) throw new Error("Rituel non trouvé");

      const updated = {
        ...ritual,
        entries: [...ritual.entries, entry],
        updatedAt: new Date().toISOString(),
      };

      await DB.save(updated);
      const rituals = get().rituals.map((r) => (r.id === ritualId ? updated : r));
      rituals.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      set({ rituals });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'ajout d'entrée";
      set({ error: message });
      throw err;
    }
  },

  deleteEntry: async (ritualId: string, entryId: string) => {
    try {
      const ritual = get().rituals.find((r) => r.id === ritualId);
      if (!ritual) throw new Error("Rituel non trouvé");

      const updated = {
        ...ritual,
        entries: ritual.entries.filter((e) => e.id !== entryId),
        updatedAt: new Date().toISOString(),
      };

      await DB.save(updated);
      const rituals = get().rituals.map((r) => (r.id === ritualId ? updated : r));
      set({ rituals });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      set({ error: message });
      throw err;
    }
  },

  importRituals: async (newRituals: Ritual[]) => {
    try {
      const current = get().rituals;
      const merged = mergeRituals(current, newRituals);
      await DB.importBulk(merged);
      merged.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      set({ rituals: merged });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'import";
      set({ error: message });
      throw err;
    }
  },

  getRitualById: (id: string) => {
    return get().rituals.find((r) => r.id === id);
  },
}));
