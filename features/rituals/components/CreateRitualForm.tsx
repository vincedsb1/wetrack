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
    <div className="h-screen flex flex-col bg-white">
      <div className="p-4 border-b flex items-center">
        <button onClick={onCancel} className="p-2 mr-2" disabled={isLoading}>
          <ChevronLeft />
        </button>
        <h2 className="font-bold text-lg">
          Nouveau Rituel ({step}/3)
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Step 1: General Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du rituel
              </label>
              <input
                autoFocus
                className="w-full border p-3 rounded-lg focus:ring-2 ring-blue-500 outline-none"
                placeholder="Ex: Couple, Bilan Hebdo..."
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setData({ ...data, frequency: f.value })}
                    className={`p-2 rounded-lg text-sm border transition ${
                      data.frequency === f.value
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Échelle de notation
              </label>
              <div className="flex gap-2">
                {SCALES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setData({ ...data, scale: s })}
                    className={`flex-1 p-3 rounded-lg border font-medium transition ${
                      data.scale === s
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
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
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Qui participe à ce rituel ?
            </p>
            {data.participants.map((p, idx) => (
              <div key={p.id} className="flex gap-2 items-center">
                <div className="relative">
                  <input
                    type="color"
                    value={p.color}
                    onChange={(e) => {
                      const newP = [...data.participants];
                      newP[idx].color = e.target.value;
                      setData({ ...data, participants: newP });
                    }}
                    className="w-10 h-10 rounded-full overflow-hidden border-0 p-0 absolute opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: p.color }}
                  ></div>
                </div>
                <input
                  className="flex-1 border p-2 rounded-lg"
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
                    className="text-red-400 p-2"
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
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Plus size={18} /> Ajouter un participant
            </button>
          </div>
        )}

        {/* Step 3: Questions */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Quelles questions allez-vous noter ?
            </p>
            {data.questions.map((q, idx) => (
              <div
                key={q.id}
                className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg"
              >
                <div className="flex flex-col gap-1 text-gray-400">
                  {idx > 0 && (
                    <button
                      onClick={() => {
                        const newQ = [...data.questions];
                        [newQ[idx], newQ[idx - 1]] = [newQ[idx - 1], newQ[idx]];
                        setData({ ...data, questions: newQ });
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
                    >
                      <MoveDown size={14} />
                    </button>
                  )}
                </div>
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-medium"
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
                  className="text-red-400 p-1"
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
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Plus size={18} /> Ajouter une question
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg active:scale-95 transition disabled:opacity-50"
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
