"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import type { Ritual, Entry, Response } from "@/lib/types";

const generateUUID = () => crypto.randomUUID();

interface WizardStep {
  question: Ritual["questions"][0];
  participant: Ritual["participants"][0];
  questionIndex: number;
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
    ritual.questions.forEach((q, qIdx) => {
      ritual.participants.forEach((p) => {
        s.push({ question: q, participant: p, questionIndex: qIdx });
      });
    });
    return s;
  }, [ritual]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const currentStep = steps[currentStepIndex];
  const progress = (currentStepIndex / steps.length) * 100;

  const handleValueSelect = (val: number) => {
    const key = `q_${currentStep.question.id}_p_${currentStep.participant.id}`;
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
        const match = key.match(/^q_(.+)_p_(.+)$/);
        if (!match) throw new Error(`Invalid response key format: ${key}`);
        const [, qId, pId] = match;
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

  const currentKey = `q_${currentStep.question.id}_p_${currentStep.participant.id}`;
  const currentValue = responses[currentKey];

  return (
    <div id="answerWizardContainer" style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
    }}>
      {/* Header */}
      <div
        id="answerWizardHeader"
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Link
          id="answerWizardLogoLink"
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            cursor: "pointer",
          }}
          title="Retour à l'accueil"
        >
          <div
            id="answerWizardLogoContainer"
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              id="answerWizardLogoImage"
              src="/icon.svg"
              alt="Rituels de Notes"
              width={32}
              height={32}
              priority
            />
          </div>
          <span
            id="answerWizardLogoText"
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#2563eb",
              marginTop: "2px",
            }}
          >
            WeTrack
          </span>
        </Link>
        <button
          id="answerWizardPrevButton"
          onClick={currentStepIndex === 0 ? onCancel : handlePrev}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            color: "#9ca3af",
            opacity: isLoading ? 0.5 : 1,
            padding: "8px",
          }}
          disabled={isLoading}
          title={currentStepIndex === 0 ? "Annuler" : "Précédent"}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div
        id="answerWizardProgressBarContainer"
        style={{
          height: "4px",
          backgroundColor: "#f3f4f6",
          width: "100%",
        }}
      >
        <div
          id="answerWizardProgressBarFill"
          style={{
            height: "100%",
            backgroundColor: "#2563eb",
            transition: "width 0.3s ease-in-out",
            width: `${progress}%`,
          }}
        />
      </div>

      <div
        id="answerWizardContent"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "24px",
        }}
      >
        {/* Question Block - min 1/3 height, aligned to top */}
        <div
          id="answerWizardQuestionContainer"
          style={{
            minHeight: "33.33%",
            width: "100%",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div id="answerWizardQuestionHeader" style={{ marginBottom: "12px" }}>
            <span
              id="answerWizardQuestionNumber"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#6b7280",
              }}
            >
              Question {currentStep.questionIndex + 1} / {ritual.questions.length}
            </span>
          </div>
          <h2
            id="answerWizardQuestionText"
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1f2937",
              lineHeight: 1.3,
              margin: "0 0 12px 0",
            }}
          >
            {currentStep.question.text}
          </h2>
          {currentStep.question.details && (
            <p
              id="answerWizardQuestionDetails"
              style={{
                fontSize: "13px",
                color: "#6b7280",
                margin: "0 0 16px 0",
                fontStyle: "italic",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {currentStep.question.details}
            </p>
          )}
        </div>

        {/* Participant + Rating Block */}
        <div
          id="answerWizardAnswerBlock"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            width: "100%",
          }}
        >
          <span
            id="answerWizardParticipantBadge"
            style={{
              display: "inline-block",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "4px",
              paddingBottom: "4px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "white",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              backgroundColor: currentStep.participant.color,
            }}
          >
            {currentStep.participant.name}
          </span>

          {/* Rating Grid */}
          <div
            id="answerWizardRatingGrid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(5, ritual.scale)}, 1fr)`,
              gap: "12px",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            {Array.from({ length: ritual.scale }, (_, i) => i + 1).map((val) => (
              <button
                id={`answerWizardRatingButton${val}`}
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
    </div>
  );
}
