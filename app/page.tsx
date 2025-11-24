"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Settings } from "lucide-react";
import { useRitualsStore } from "@/store/rituals.store";
import { useUIStore } from "@/store/ui.store";
import { RitualCard } from "@/features/rituals/components/RitualCard";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { rituals, loading, loadRituals } = useRitualsStore();
  const { notification } = useUIStore();

  useEffect(() => {
    setMounted(true);
    loadRituals().catch((err) => {
      setLoadError(err instanceof Error ? err.message : "Unknown error");
    });
  }, [loadRituals]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{ width: "100%", height: "100vh", backgroundColor: "#f3f4f6" }} />
    );
  }

  if (loadError) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div style={{ color: "red", textAlign: "center" }}>
          <p>❌ Error: {loadError}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "32px",
              marginBottom: "16px",
              color: "#2563eb",
            }}
          >
            ⏳
          </div>
          <p style={{ color: "#4b5563" }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        maxWidth: "448px",
        margin: "0 auto",
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* Notification Toast */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            right: "16px",
            zIndex: 50,
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            color: "white",
            textAlign: "center",
            backgroundColor:
              notification.type === "error" ? "#ef4444" : "#16a34a",
          }}
        >
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Mes Rituels
        </h1>
        <Link
          href="/settings"
          style={{
            padding: "8px",
            backgroundColor: "#f3f4f6",
            borderRadius: "9999px",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          <Settings size={20} />
        </Link>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "16px",
          paddingBottom: "96px",
        }}
      >
        {rituals.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "256px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#dbeafe",
                padding: "16px",
                borderRadius: "9999px",
                marginBottom: "16px",
                color: "#2563eb",
                fontSize: "48px",
              }}
            >
              📋
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Aucun rituel
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "24px",
                maxWidth: "280px",
              }}
            >
              Créez votre premier rituel pour commencer à suivre votre évolution.
            </p>
            <Link
              href="/rituals/new"
              style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingTop: "12px",
                paddingBottom: "12px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "9999px",
                fontWeight: "600",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Créer un rituel
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {rituals.map((ritual) => (
              <RitualCard key={ritual.id} ritual={ritual} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
        }}
      >
        <Link
          href="/rituals/new"
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "9999px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <Plus size={28} />
        </Link>
      </div>
    </div>
  );
}
