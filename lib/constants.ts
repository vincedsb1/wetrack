import type { Frequency, Scale } from "./types";

export const SCALES: Scale[] = [5, 10, 20, 100];

export const FREQUENCIES: Array<{ value: Frequency; label: string; days: number }> = [
  { value: "daily", label: "Quotidien", days: 1 },
  { value: "weekly", label: "Hebdomadaire", days: 7 },
  { value: "monthly", label: "Mensuel", days: 30 },
];

export const COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // amber
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#6366F1", // indigo
];

export const DB_NAME = "RituelsDB";
export const DB_VERSION = 1;
export const STORE_NAME = "rituals";
