/**
 * Centralized Types for Rituels de Notes
 * Source of truth for all data models
 */

export type Frequency = "daily" | "weekly" | "monthly";
export type Scale = 5 | 10 | 20 | 100;

export interface Participant {
  id: string; // UUID
  name: string;
  color: string; // hex #RRGGBB
}

export interface Question {
  id: string; // UUID
  text: string;
  details?: string; // Optional detailed description
  order: number;
}

export interface Response {
  questionId: string;
  participantId: string;
  value: number; // 1 <= value <= scale
}

export interface Entry {
  id: string; // UUID
  ritualId: string;
  createdAt: string; // ISO date
  responses: Response[];
}

export interface Ritual {
  id: string; // UUID
  title: string;
  scale: Scale;
  frequency: Frequency;
  participants: Participant[];
  questions: Question[];
  entries: Entry[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface ExportData {
  version: 1;
  exportedAt: string; // ISO date
  rituals: Ritual[];
}

/**
 * UI / Wizard State
 */
export interface WizardState {
  currentStepIndex: number;
  responses: Record<string, number>; // key: "qId-pId", value: score
}

export interface GraphSettings {
  mode: 1 | 2 | 3 | 4;
  selectedQuestionId?: string;
}

export interface UIState {
  currentView: "HOME" | "CREATE" | "RITUAL_DETAIL" | "WIZARD" | "ENTRY_DETAIL" | "SETTINGS";
  activeRitualId: string | null;
  activeEntryId: string | null;
  notification: { msg: string; type: "success" | "error" } | null;
  graphSettings: GraphSettings;
  wizardState: WizardState;
}
