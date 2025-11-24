"use client";

import Link from "next/link";
import { AlertCircle, BarChart2, Calendar } from "lucide-react";
import { formatDateShort, getRelativeDateStatus } from "@/lib/date";
import { FREQUENCIES } from "@/lib/constants";
import type { Ritual } from "@/lib/types";

interface RitualCardProps {
  ritual: Ritual;
}

export function RitualCard({ ritual }: RitualCardProps) {
  const lastEntry = ritual.entries[ritual.entries.length - 1];
  const status = getRelativeDateStatus(lastEntry?.createdAt, ritual.frequency);

  return (
    <Link href={`/rituals/${ritual.id}`}>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{ritual.title}</h3>
          {status.isDue && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <AlertCircle size={12} /> À faire
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {ritual.participants.map((p) => (
            <span
              key={p.id}
              className="text-xs px-2 py-0.5 rounded-md bg-gray-100 border text-gray-600 flex items-center gap-1"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              ></span>
              {p.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t">
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {FREQUENCIES.find((f) => f.value === ritual.frequency)?.label}
            </span>
            <span className="flex items-center gap-1">
              <BarChart2 size={12} /> /{ritual.scale}
            </span>
          </div>
          <span>
            Dernier: {lastEntry ? formatDateShort(lastEntry.createdAt) : "-"}
          </span>
        </div>
      </div>
    </Link>
  );
}
