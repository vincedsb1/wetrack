import { useMemo } from "react";
import type { Ritual, Entry } from "@/lib/types";

/**
 * Chart data calculation hooks
 * Generates data for 4 chart modes per spec 9.2
 */

interface ChartDataPoint {
  entryId: string;
  date: string;
  index: number;
  [key: string]: string | number;
}

export const useChartData = (
  ritual: Ritual | null,
  graphMode: 1 | 2 | 3 | 4,
  selectedQuestionId?: string
): ChartDataPoint[] => {
  return useMemo(() => {
    if (!ritual || ritual.entries.length === 0) return [];

    const sortedEntries = [...ritual.entries].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedEntries.map((entry, idx) => {
      const point: ChartDataPoint = { 
        entryId: entry.id, 
        date: entry.createdAt,
        index: idx + 1 
      };

      if (graphMode === 1) {
        // Mode 1: Per person, specific question
        ritual.participants.forEach((p) => {
          const resp = entry.responses.find(
            (r) => r.participantId === p.id && r.questionId === selectedQuestionId
          );
          point[p.id] = resp ? resp.value : 0;
        });
      } else if (graphMode === 2) {
        // Mode 2: Per person, average
        ritual.participants.forEach((p) => {
          const myResponses = entry.responses.filter((r) => r.participantId === p.id);
          const avg = myResponses.length > 0
            ? myResponses.reduce((sum, r) => sum + r.value, 0) / myResponses.length
            : 0;
          point[p.id] = Number(avg.toFixed(2));
        });
      } else if (graphMode === 3) {
        // Mode 3: Global average for specific question
        const qResponses = entry.responses.filter(
          (r) => r.questionId === selectedQuestionId
        );
        const avg = qResponses.length > 0
          ? qResponses.reduce((sum, r) => sum + r.value, 0) / qResponses.length
          : 0;
        point.global = Number(avg.toFixed(2));
      } else if (graphMode === 4) {
        // Mode 4: Global average (all responses)
        const avg = entry.responses.length > 0
          ? entry.responses.reduce((sum, r) => sum + r.value, 0) / entry.responses.length
          : 0;
        point.global = Number(avg.toFixed(2));
      }

      return point;
    });
  }, [ritual, graphMode, selectedQuestionId]);
};

export const useChartLines = (ritual: Ritual | null, graphMode: 1 | 2 | 3 | 4) => {
  return useMemo(() => {
    if (!ritual) return [];

    if (graphMode === 1 || graphMode === 2) {
      return ritual.participants.map((p) => ({
        key: p.id,
        color: p.color,
        name: p.name,
      }));
    }

    return [{ key: "global", color: "#3B82F6", name: "Moyenne" }];
  }, [ritual, graphMode]);
};
