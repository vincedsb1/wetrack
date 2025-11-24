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
    <div className="h-screen flex flex-col bg-white">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-100 w-full">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <button
          onClick={currentStepIndex === 0 ? onCancel : handlePrev}
          className="text-gray-400 disabled:opacity-50"
          disabled={isLoading}
        >
          <ChevronLeft />
        </button>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {currentStepIndex + 1} / {steps.length}
        </span>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 text-white shadow-sm"
            style={{ backgroundColor: currentStep.participant.color }}
          >
            {currentStep.participant.name}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {currentStep.question.text}
          </h2>
        </div>

        {/* Rating Grid */}
        <div className="grid grid-cols-5 gap-3 w-full max-w-xs">
          {Array.from({ length: ritual.scale }, (_, i) => i + 1).map((val) => (
            <button
              key={val}
              onClick={() => handleValueSelect(val)}
              disabled={isLoading}
              className={`
                aspect-square rounded-xl text-lg font-bold border-2 transition-all disabled:opacity-50
                ${
                  currentValue === val
                    ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg"
                    : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                }
              `}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
