"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import { formatDate } from "@/lib/date";
import { LineChartPanel } from "@/features/charts/components/LineChart";
import { useChartData, useChartLines } from "@/features/charts/hooks/useChartData";

export default function RitualDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ritualId = params.ritualId as string;

  const { getRitualById, deleteRitual, deleteEntry, loading } = useRitualsStore();
  const { notify } = useUIStore();

  const ritual = getRitualById(ritualId);
  const [activeTab, setActiveTab] = useState<"history" | "stats">("history");
  const [graphMode, setGraphMode] = useState<1 | 2 | 3 | 4>(4);
  const [selectedQuestionId, setSelectedQuestionId] = useState(
    ritual?.questions[0]?.id || ""
  );

  const graphData = useChartData(ritual || null, graphMode, selectedQuestionId);
  const graphLines = useChartLines(ritual || null, graphMode);

  useEffect(() => {
    if (ritual && selectedQuestionId === "") {
      setSelectedQuestionId(ritual.questions[0]?.id || "");
    }
  }, [ritual, selectedQuestionId]);

  if (!ritual) {
    return (
      <div className="flex items-center justify-center h-screen">
        Rituel non trouvé
      </div>
    );
  }

  const handleDeleteRitual = async () => {
    if (
      !confirm(
        "Supprimer définitivement ce rituel et tout son historique ?"
      )
    )
      return;

    try {
      await deleteRitual(ritual.id);
      notify("Rituel supprimé", "success");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors de la suppression";
      notify(message, "error");
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Supprimer cette entrée ?")) return;

    try {
      await deleteEntry(ritual.id, entryId);
      notify("Entrée supprimée", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors de la suppression";
      notify(message, "error");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-20">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg">{ritual.title}</h2>
          <p className="text-xs text-gray-500">
            {ritual.frequency} • Échelle /{ritual.scale}
          </p>
        </div>
        <button
          onClick={handleDeleteRitual}
          disabled={loading}
          className="p-2 -mr-2 text-red-400 disabled:opacity-50"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Action Button */}
      <div className="p-4 pb-0 bg-gray-50 border-b">
        <Link
          href={`/rituals/${ritual.id}/answer`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md mb-4 flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Répondre maintenant
        </Link>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 px-2 text-sm font-medium border-b-2 transition ${
              activeTab === "history"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Historique
          </button>
          <button
            className={`pb-2 px-2 text-sm font-medium border-b-2 transition ${
              activeTab === "stats"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Graphiques
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {activeTab === "history" && (
          <div className="space-y-4">
            {ritual.entries.length === 0 && (
              <p className="text-center text-gray-400 mt-10">
                Aucune entrée pour le moment.
              </p>
            )}
            {[...ritual.entries].reverse().map((entry) => {
              const totalAvg = (
                entry.responses.reduce((acc, r) => acc + r.value, 0) /
                entry.responses.length
              ).toFixed(1);

              return (
                <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-700">
                      {formatDate(entry.createdAt)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                      Moy: {totalAvg}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {ritual.questions.map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center text-sm border-b border-dashed border-gray-100 pb-1 last:border-0"
                      >
                        <span className="flex-1 text-gray-600 truncate mr-2">
                          {q.text}
                        </span>
                        <div className="flex gap-1">
                          {ritual.participants.map((p) => {
                            const r = entry.responses.find(
                              (res) =>
                                res.questionId === q.id &&
                                res.participantId === p.id
                            );
                            return (
                              <span
                                key={p.id}
                                className="w-6 h-6 rounded flex items-center justify-center text-xs text-white font-medium"
                                style={{ backgroundColor: p.color }}
                              >
                                {r ? r.value : "-"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/rituals/${ritual.id}/entries/${entry.id}`}
                      className="text-xs text-blue-500 hover:text-blue-700 flex-1"
                    >
                      Voir détails
                    </Link>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={loading}
                      className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "stats" && (
          <div>
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4 space-y-3">
              <select
                className="w-full p-2 border rounded bg-gray-50 text-sm"
                value={graphMode}
                onChange={(e) => setGraphMode(Number(e.target.value) as 1 | 2 | 3 | 4)}
              >
                <option value={1}>Par personne : évolution question</option>
                <option value={2}>Par personne : évolution moyenne</option>
                <option value={3}>Global : moyenne question</option>
                <option value={4}>Global : moyenne générale</option>
              </select>

              {(graphMode === 1 || graphMode === 3) && (
                <select
                  className="w-full p-2 border rounded bg-gray-50 text-sm"
                  value={selectedQuestionId}
                  onChange={(e) => setSelectedQuestionId(e.target.value)}
                >
                  {ritual.questions.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.text}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <LineChartPanel
              data={graphData}
              lines={graphLines}
              scale={ritual.scale}
              title="Évolution"
            />
          </div>
        )}
      </div>
    </div>
  );
}
