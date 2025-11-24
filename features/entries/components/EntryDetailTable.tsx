"use client";

import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Header } from "@/features/layout/components/Header";
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
  const globalAverage = entry.responses.length > 0
    ? (
      entry.responses.reduce((acc, r) => acc + r.value, 0) / entry.responses.length
    ).toFixed(1)
    : "0.0";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header showSettings={false} />

      {/* Header Info */}
      <div className="p-6 border-b bg-white">
        <h2 className="font-bold text-2xl text-gray-900 mb-1">{formatDate(entry.createdAt)}</h2>
        <p className="text-sm text-gray-600">{ritual.title}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Questions Grid */}
          <div className="space-y-4">
            {ritual.questions.map((q, qIdx) => {
              const qResponses = entry.responses.filter(
                (r) => r.questionId === q.id
              );
              const qAverage = qResponses.length > 0
                ? (
                  qResponses.reduce((acc, r) => acc + r.value, 0) /
                  qResponses.length
                ).toFixed(1)
                : "0.0";

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Question Header */}
                  <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-transparent">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Question {qIdx + 1} / {ritual.questions.length}
                      </span>
                      <span className="text-sm font-bold text-blue-600 bg-blue-100/80 px-3 py-1.5 rounded-full">
                        Moy: {qAverage}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      {q.text}
                    </h3>
                  </div>

                  {/* Responses */}
                  <div className="px-6 py-5">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-auto">
                      {ritual.participants.map((p) => {
                        const r = entry.responses.find(
                          (res) => res.questionId === q.id && res.participantId === p.id
                        );
                        return (
                          <div
                            key={p.id}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-xs font-semibold text-gray-600">
                              {p.name}
                            </span>
                            <span
                              className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md hover:shadow-lg transition-shadow"
                              style={{ backgroundColor: p.color }}
                            >
                              {r ? r.value : "-"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Global Average */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-md p-8 text-center">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Moyenne globale
            </p>
            <p className="text-5xl font-bold text-blue-600">{globalAverage}</p>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="bg-white p-6">
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="w-full bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold py-3 px-4 flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={18} /> Supprimer cette entrée
        </button>
      </div>
    </div>
  );
}
