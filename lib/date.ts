import { FREQUENCIES } from "./constants";
import type { Frequency } from "./types";

export const formatDate = (isoString: string | undefined) => {
  if (!isoString) return "Jamais";
  return new Date(isoString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateShort = (isoString: string | undefined) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

export const getRelativeDateStatus = (lastEntryDate: string | undefined, frequency: Frequency) => {
  if (!lastEntryDate) return { isDue: true, label: "Nouveau" };

  const last = new Date(lastEntryDate);
  const now = new Date();
  const freqObj = FREQUENCIES.find((f) => f.value === frequency);
  const daysToAdd = freqObj ? freqObj.days : 1;

  const nextDue = new Date(last);
  nextDue.setDate(nextDue.getDate() + daysToAdd);

  const isDue = now > nextDue;
  return { isDue, label: isDue ? "À faire" : "À jour" };
};
