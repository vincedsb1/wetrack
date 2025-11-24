"use client";

import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date";
import type { Ritual, Entry } from "@/lib/types";

interface EntryDetailTableProps {
  ritual: Ritual;
  entry: Entry;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export function EntryDetailTable({
  ritual,
  entry,
  onDelete,
  isLoading = false,
}: EntryDetailTableProps) {
  const globalAverage = (
    entry.responses.reduce((acc, r) => acc + r.value, 0) / entry.responses.length
  ).toFixed(1);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b sticky top-0 bg-white">
        <h2 className="font-bold text-lg">{formatDate(entry.createdAt)}</h2>
        <p className="text-xs text-gray-500">{ritual.title}</p>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-2 font-bold text-gray-700">
                Question
              </th>
              {ritual.participants.map((p) => (
                <th
                  key={p.id}
                  className="text-center py-2 px-2 font-bold text-xs"
                  style={{ color: p.color }}
                >
                  {p.name}
                </th>
              ))}
              <th className="text-center py-2 px-2 font-bold text-gray-600">
                Moy.
              </th>
            </tr>
          </thead>
          <tbody>
            {ritual.questions.map((q) => {
              const qResponses = entry.responses.filter(
                (r) => r.questionId === q.id
              );
              const qAverage = (
                qResponses.reduce((acc, r) => acc + r.value, 0) /
                qResponses.length
              ).toFixed(1);

              return (
                <tr key={q.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-2 text-left text-gray-700">
                    {q.text}
                  </td>
                  {ritual.participants.map((p) => {
                    const r = entry.responses.find(
                      (res) => res.questionId === q.id && res.participantId === p.id
                    );
                    return (
                      <td key={p.id} className="text-center py-2 px-2">
                        <span
                          className="inline-block w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: p.color }}
                        >
                          {r ? r.value : "-"}
                        </span>
                      </td>
                    );
                  })}
                  <td className="text-center py-2 px-2 text-gray-600 font-semibold">
                    {qAverage}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-gray-50 space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Moyenne globale</p>
          <p className="text-2xl font-bold text-blue-600">{globalAverage}</p>
        </div>

        <button
          onClick={onDelete}
          disabled={isLoading}
          className="w-full text-red-500 hover:text-red-700 flex items-center justify-center gap-2 py-2 font-medium disabled:opacity-50"
        >
          <Trash2 size={16} /> Supprimer cette entrée
        </button>
      </div>
    </div>
  );
}
