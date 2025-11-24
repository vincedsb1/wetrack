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
    <Link href={`/rituals/${ritual.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        transition: "all 0.2s",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}>
          <h3 style={{
            fontWeight: "bold",
            fontSize: "18px",
            color: "#1f2937",
            margin: 0,
          }}>
            {ritual.title}
          </h3>
          {status.isDue && (
            <span style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              fontSize: "12px",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingTop: "4px",
              paddingBottom: "4px",
              borderRadius: "9999px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap",
            }}>
              <AlertCircle size={12} /> À faire
            </span>
          )}
        </div>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "12px",
        }}>
          {ritual.participants.map((p) => (
            <span
              key={p.id}
              style={{
                fontSize: "12px",
                paddingLeft: "8px",
                paddingRight: "8px",
                paddingTop: "2px",
                paddingBottom: "2px",
                borderRadius: "6px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
                color: "#4b5563",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: p.color,
                }}
              />
              {p.name}
            </span>
          ))}
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#6b7280",
          marginTop: "8px",
          paddingTop: "8px",
          borderTop: "1px solid #e5e7eb",
        }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={12} />
              {FREQUENCIES.find((f) => f.value === ritual.frequency)?.label}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
