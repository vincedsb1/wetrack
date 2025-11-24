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
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}>
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
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "white",
      maxWidth: "448px",
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        zIndex: 20,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: "8px",
            marginLeft: "-8px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#4b5563",
          }}
        >
          <ChevronLeft />
        </button>
        <div style={{ textAlign: "center" }}>
          <h2 style={{
            fontWeight: "bold",
            fontSize: "18px",
            margin: 0,
            color: "#111827",
          }}>
            {ritual.title}
          </h2>
          <p style={{
            fontSize: "12px",
            color: "#6b7280",
            margin: "4px 0 0 0",
          }}>
            {ritual.frequency} • Échelle /{ritual.scale}
          </p>
        </div>
        <button
          onClick={handleDeleteRitual}
          disabled={loading}
          style={{
            padding: "8px",
            marginRight: "-8px",
            backgroundColor: "transparent",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            color: "#f87171",
            opacity: loading ? 0.5 : 1,
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Action Button */}
      <div style={{
        padding: "16px",
        paddingBottom: 0,
        backgroundColor: "#f3f4f6",
        borderBottom: "1px solid #e5e7eb",
      }}>
        <Link
          href={`/rituals/${ritual.id}/answer`}
          style={{
            width: "100%",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: "bold",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <Plus size={20} /> Répondre maintenant
        </Link>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <button
            style={{
              paddingBottom: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              fontSize: "14px",
              fontWeight: "500",
              borderTop: "none",
              borderRight: "none",
              borderLeft: "none",
              borderBottom: activeTab === "history" ? "2px solid #2563eb" : "2px solid transparent",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: activeTab === "history" ? "#2563eb" : "#6b7280",
              transition: "all 0.2s",
            }}
            onClick={() => setActiveTab("history")}
          >
            Historique
          </button>
          <button
            style={{
              paddingBottom: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              fontSize: "14px",
              fontWeight: "500",
              borderTop: "none",
              borderRight: "none",
              borderLeft: "none",
              borderBottom: activeTab === "stats" ? "2px solid #2563eb" : "2px solid transparent",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: activeTab === "stats" ? "#2563eb" : "#6b7280",
              transition: "all 0.2s",
            }}
            onClick={() => setActiveTab("stats")}
          >
            Graphiques
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        backgroundColor: "#f3f4f6",
        padding: "16px",
      }}>
        {activeTab === "history" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {ritual.entries.length === 0 && (
              <p style={{
                textAlign: "center",
                color: "#9ca3af",
                marginTop: "40px",
              }}>
                Aucune entrée pour le moment.
              </p>
            )}
            {[...ritual.entries].reverse().map((entry) => {
              const totalAvg = (
                entry.responses.reduce((acc, r) => acc + r.value, 0) /
                entry.responses.length
              ).toFixed(1);

              return (
                <div
                  key={entry.id}
                  style={{
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "12px",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}>
                    <span style={{
                      fontWeight: "bold",
                      color: "#374151",
                    }}>
                      {formatDate(entry.createdAt)}
                    </span>
                    <span style={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      fontSize: "12px",
                      fontWeight: "bold",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                      paddingTop: "4px",
                      paddingBottom: "4px",
                      borderRadius: "4px",
                    }}>
                      Moy: {totalAvg}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                    {ritual.questions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "14px",
                          borderBottom: qIdx < ritual.questions.length - 1 ? "1px dashed #e5e7eb" : "none",
                          paddingBottom: "8px",
                        }}
                      >
                        <span style={{
                          flex: 1,
                          color: "#4b5563",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginRight: "8px",
                        }}>
                          {q.text}
                        </span>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {ritual.participants.map((p) => {
                            const r = entry.responses.find(
                              (res) =>
                                res.questionId === q.id &&
                                res.participantId === p.id
                            );
                            return (
                              <span
                                key={p.id}
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  color: "white",
                                  fontWeight: "500",
                                  backgroundColor: p.color,
                                }}
                              >
                                {r ? r.value : "-"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      href={`/rituals/${ritual.id}/entries/${entry.id}`}
                      style={{
                        fontSize: "12px",
                        color: "#3b82f6",
                        flex: 1,
                        textDecoration: "none",
                      }}
                    >
                      Voir détails
                    </Link>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={loading}
                      style={{
                        fontSize: "12px",
                        color: "#f87171",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        opacity: loading ? 0.5 : 1,
                      }}
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
            <div style={{
              backgroundColor: "white",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}>
              <select
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  backgroundColor: "#f3f4f6",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
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
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    backgroundColor: "#f3f4f6",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
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
