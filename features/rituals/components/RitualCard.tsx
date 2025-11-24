"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, BarChart2, Calendar, Trash2 } from "lucide-react";
import { formatDateShort, getRelativeDateStatus } from "@/lib/date";
import { FREQUENCIES } from "@/lib/constants";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import type { Ritual } from "@/lib/types";

interface RitualCardProps {
  ritual: Ritual;
}

export function RitualCard({ ritual }: RitualCardProps) {
  const lastEntry = ritual.entries[ritual.entries.length - 1];
  const status = getRelativeDateStatus(lastEntry?.createdAt, ritual.frequency);

  const { deleteRitual, loading } = useRitualsStore();
  const { notify } = useUIStore();

  const [swipeX, setSwipeX] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;

    // Only allow swipe left (negative values), max swipe of -80px
    if (diff < 0) {
      setSwipeX(Math.max(diff, -80));
    } else {
      setSwipeX(0);
    }
  };

  const handleTouchEnd = () => {
    // If swiped more than 30px, keep it open; otherwise, close
    if (swipeX < -30) {
      setSwipeX(-80);
    } else {
      setSwipeX(0);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteRitual(ritual.id);
      notify("Rituel supprimé", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
      notify(message, "error");
    }
  };

  return (
    <>
      {/* Swipe Delete Container */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        marginBottom: "16px",
      }}>
        {/* Delete Button Background */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "80px",
          height: "100%",
          backgroundColor: "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}>
          <button
            onClick={handleDeleteClick}
            disabled={loading}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              color: "white",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.5 : 1,
            }}
          >
            <Trash2 size={24} />
          </button>
        </div>

        {/* Card */}
        <Link href={`/rituals/${ritual.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              transition: swipeX !== 0 ? "none" : "transform 0.3s ease-out",
              transform: `translateX(${swipeX}px)`,
              position: "relative",
              zIndex: 2,
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
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "300px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#111827",
              margin: "0 0 12px 0",
            }}>
              Supprimer ce rituel ?
            </h3>
            <p style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0 0 24px 0",
            }}>
              Cette action est irréversible. Tous les historiques seront perdus.
            </p>
            <div style={{
              display: "flex",
              gap: "12px",
            }}>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#e5e7eb",
                  color: "#111827",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
