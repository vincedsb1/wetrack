"use client";

import { useState } from "react";
import { ChevronLeft, MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import { SCALES, FREQUENCIES, COLORS } from "@/lib/constants";
import type { Ritual, Question, Participant } from "@/lib/types";

const generateUUID = () => crypto.randomUUID();

interface CreateRitualFormProps {
  onCancel: () => void;
  onSave: (ritual: Ritual) => Promise<void>;
  isLoading?: boolean;
}

export function CreateRitualForm({
  onCancel,
  onSave,
  isLoading = false,
}: CreateRitualFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [data, setData] = useState<{
    title: string;
    frequency: "daily" | "weekly" | "monthly";
    scale: number;
    participants: Participant[];
    questions: Question[];
  }>({
    title: "",
    frequency: "weekly",
    scale: 10,
    participants: [{ id: generateUUID(), name: "", color: COLORS[0] }],
    questions: [],
  });

  const validateStep = () => {
    if (step === 1) return data.title.trim().length > 0;
    if (step === 2)
      return (
        data.participants.length >= 1 &&
        data.participants.every((p) => p.name.trim())
      );
    if (step === 3)
      return (
        data.questions.length >= 1 &&
        data.questions.every((q) => q.text.trim())
      );
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      alert("Veuillez remplir correctement les champs.");
      return;
    }

    if (step === 3) {
      // Create ritual
      const ritual: Ritual = {
        id: generateUUID(),
        title: data.title,
        scale: data.scale as 5 | 10 | 20 | 100,
        frequency: data.frequency,
        participants: data.participants,
        questions: data.questions.map((q, idx) => ({
          ...q,
          order: idx,
        })),
        entries: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await onSave(ritual);
    } else {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={onCancel}
          disabled={isLoading}
          style={{
            padding: "8px",
            marginRight: "8px",
            background: "none",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          <ChevronLeft />
        </button>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            margin: 0,
          }}
        >
          Nouveau Rituel ({step}/3)
        </h2>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
        }}
      >
        {/* Step 1: General Info */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Titre du rituel
              </label>
              <input
                autoFocus
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                placeholder="Ex: Couple, Bilan Hebdo..."
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Fréquence
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setData({ ...data, frequency: f.value })}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      border:
                        data.frequency === f.value
                          ? "2px solid #2563eb"
                          : "1px solid #d1d5db",
                      backgroundColor:
                        data.frequency === f.value ? "#eff6ff" : "white",
                      color:
                        data.frequency === f.value ? "#2563eb" : "#6b7280",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "all 0.2s",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Échelle de notation
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {SCALES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setData({ ...data, scale: s })}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border:
                        data.scale === s ? "none" : "1px solid #d1d5db",
                      backgroundColor:
                        data.scale === s ? "#2563eb" : "white",
                      color: data.scale === s ? "white" : "#111827",
                      fontWeight: "500",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    /{s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Participants */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
              Qui participe à ce rituel ?
            </p>
            {data.participants.map((p, idx) => (
              <div key={p.id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="color"
                    value={p.color}
                    onChange={(e) => {
                      const newP = [...data.participants];
                      newP[idx].color = e.target.value;
                      setData({ ...data, participants: newP });
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <input
                  style={{
                    flex: 1,
                    border: "1px solid #d1d5db",
                    padding: "8px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder="Prénom"
                  value={p.name}
                  onChange={(e) => {
                    const newP = [...data.participants];
                    newP[idx].name = e.target.value;
                    setData({ ...data, participants: newP });
                  }}
                />
                {data.participants.length > 1 && (
                  <button
                    onClick={() =>
                      setData({
                        ...data,
                        participants: data.participants.filter(
                          (_, i) => i !== idx
                        ),
                      })
                    }
                    style={{
                      color: "#f87171",
                      padding: "8px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() =>
                setData({
                  ...data,
                  participants: [
                    ...data.participants,
                    {
                      id: generateUUID(),
                      name: "",
                      color: COLORS[data.participants.length % COLORS.length],
                    },
                  ],
                })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                color: "#6b7280",
                backgroundColor: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Plus size={18} /> Ajouter un participant
            </button>
          </div>
        )}

        {/* Step 3: Questions */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
              Quelles questions allez-vous noter ?
            </p>
            {data.questions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "#9ca3af" }}>
                  {idx > 0 && (
                    <button
                      onClick={() => {
                        const newQ = [...data.questions];
                        [newQ[idx], newQ[idx - 1]] = [newQ[idx - 1], newQ[idx]];
                        setData({ ...data, questions: newQ });
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <MoveUp size={14} />
                    </button>
                  )}
                  {idx < data.questions.length - 1 && (
                    <button
                      onClick={() => {
                        const newQ = [...data.questions];
                        [newQ[idx], newQ[idx + 1]] = [newQ[idx + 1], newQ[idx]];
                        setData({ ...data, questions: newQ });
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <MoveDown size={14} />
                    </button>
                  )}
                </div>
                <input
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    border: "none",
                    fontWeight: "500",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  placeholder="Texte de la question..."
                  value={q.text}
                  onChange={(e) => {
                    const newQ = [...data.questions];
                    newQ[idx].text = e.target.value;
                    setData({ ...data, questions: newQ });
                  }}
                />
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      questions: data.questions.filter((_, i) => i !== idx),
                    })
                  }
                  style={{
                    color: "#f87171",
                    padding: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setData({
                  ...data,
                  questions: [
                    ...data.questions,
                    {
                      id: generateUUID(),
                      text: "",
                      order: data.questions.length,
                    },
                  ],
                })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                color: "#6b7280",
                backgroundColor: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Plus size={18} /> Ajouter une question
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <button
          onClick={handleNext}
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
            fontSize: "16px",
          }}
        >
          {isLoading
            ? "Création..."
            : step === 3
              ? "Créer le rituel"
              : "Continuer"}
        </button>
      </div>
    </div>
  );
}
