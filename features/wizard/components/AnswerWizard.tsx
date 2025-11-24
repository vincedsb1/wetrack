"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { Ritual, Entry, Response } from "@/lib/types";

const generateUUID = () => crypto.randomUUID();

interface WizardStep {
  question: Ritual["questions"][0];
  participant: Ritual["participants"][0];
}

interface AnswerWizardProps {
  ritual: Ritual;
  onCancel: () => void;
  onFinish: (entry: Entry) => Promise<void>;
  isLoading?: boolean;
}

export function AnswerWizard({
  ritual,
  onCancel,
  onFinish,
  isLoading = false,
}: AnswerWizardProps) {
  const steps = useMemo<WizardStep[]>(() => {
    const s: WizardStep[] = [];
    ritual.questions.forEach((q) => {
      ritual.participants.forEach((p) => {
        s.push({ question: q, participant: p });
      });
    });
    return s;
  }, [ritual]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const currentStep = steps[currentStepIndex];
  const progress = (currentStepIndex / steps.length) * 100;

  const handleValueSelect = (val: number) => {
    const key = `${currentStep.question.id}-${currentStep.participant.id}`;
    const newResponses = { ...responses, [key]: val };
    setResponses(newResponses);

    if (currentStepIndex < steps.length - 1) {
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 150);
    } else {
      finalize(newResponses);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const finalize = async (finalResponses: Record<string, number>) => {
    const responseArray: Response[] = Object.entries(finalResponses).map(
      ([key, val]) => {
        const [qId, pId] = key.split("-");
        return { questionId: qId, participantId: pId, value: val };
      }
    );

    const entry: Entry = {
      id: generateUUID(),
      ritualId: ritual.id,
      createdAt: new Date().toISOString(),
      responses: responseArray,
    };

    await onFinish(entry);
  };

  const currentKey = `${currentStep.question.id}-${currentStep.participant.id}`;
  const currentValue = responses[currentKey];

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
    }}>
      {/* Progress Bar */}
      <div style={{
        height: "4px",
        backgroundColor: "#f3f4f6",
        width: "100%",
      }}>
        <div
          style={{
            height: "100%",
            backgroundColor: "#2563eb",
            transition: "width 0.3s ease-in-out",
            width: `${progress}%`,
          }}
        />
      </div>

      <div style={{
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <button
          onClick={currentStepIndex === 0 ? onCancel : handlePrev}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            color: "#9ca3af",
            opacity: isLoading ? 0.5 : 1,
            padding: "0",
          }}
          disabled={isLoading}
        >
          <ChevronLeft />
        </button>
        <span style={{
          fontSize: "12px",
          fontWeight: "bold",
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          {currentStepIndex + 1} / {steps.length}
        </span>
        <div style={{ width: "24px" }}></div>
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: "24px" }}>
          <span
            style={{
              display: "inline-block",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "4px",
              paddingBottom: "4px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "white",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              backgroundColor: currentStep.participant.color,
            }}
          >
            {currentStep.participant.name}
          </span>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#1f2937",
            lineHeight: 1.3,
            margin: 0,
          }}>
            {currentStep.question.text}
          </h2>
        </div>

        {/* Rating Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(5, ritual.scale)}, 1fr)`,
          gap: "12px",
          width: "100%",
          maxWidth: "320px",
        }}>
          {Array.from({ length: ritual.scale }, (_, i) => i + 1).map((val) => (
            <button
              key={val}
              onClick={() => handleValueSelect(val)}
              disabled={isLoading}
              style={{
                aspectRatio: "1",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                borderTop: currentValue === val ? "2px solid #2563eb" : "2px solid #e5e7eb",
                borderRight: currentValue === val ? "2px solid #2563eb" : "2px solid #e5e7eb",
                borderBottom: currentValue === val ? "2px solid #2563eb" : "2px solid #e5e7eb",
                borderLeft: currentValue === val ? "2px solid #2563eb" : "2px solid #e5e7eb",
                transition: "all 0.2s",
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
                backgroundColor: currentValue === val ? "#2563eb" : "white",
                color: currentValue === val ? "white" : "#4b5563",
                transform: currentValue === val ? "scale(1.1)" : "scale(1)",
                boxShadow: currentValue === val ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "none",
              }}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
