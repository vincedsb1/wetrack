"use client";

import { create } from "zustand";
import type { UIState, GraphSettings, WizardState } from "@/lib/types";

interface UIStoreState extends UIState {
  setView: (view: UIState["currentView"]) => void;
  setActiveRitualId: (id: string | null) => void;
  setActiveEntryId: (id: string | null) => void;
  notify: (msg: string, type: "success" | "error") => void;
  clearNotification: () => void;
  setGraphSettings: (settings: Partial<GraphSettings>) => void;
  setWizardState: (state: Partial<WizardState>) => void;
  resetWizardState: () => void;
}

const initialWizardState: WizardState = {
  currentStepIndex: 0,
  responses: {},
};

const initialGraphSettings: GraphSettings = {
  mode: 4,
};

export const useUIStore = create<UIStoreState>((set) => ({
  currentView: "HOME",
  activeRitualId: null,
  activeEntryId: null,
  notification: null,
  graphSettings: initialGraphSettings,
  wizardState: initialWizardState,

  setView: (view) => set({ currentView: view }),

  setActiveRitualId: (id) => set({ activeRitualId: id }),

  setActiveEntryId: (id) => set({ activeEntryId: id }),

  notify: (msg, type = "success") => {
    set({ notification: { msg, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  clearNotification: () => set({ notification: null }),

  setGraphSettings: (settings) =>
    set((state) => ({
      graphSettings: { ...state.graphSettings, ...settings },
    })),

  resetWizardState: () => set({ wizardState: initialWizardState }),

  setWizardState: (state) =>
    set((prev) => ({
      wizardState: { ...prev.wizardState, ...state },
    })),
}));
