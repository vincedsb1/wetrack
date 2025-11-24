"use client";

import Link from "next/link";
import Image from "next/image";
import { Settings } from "lucide-react";

interface HeaderProps {
  showSettings?: boolean;
}

export function Header({ showSettings = false }: HeaderProps) {
  return (
    <header
      style={{
        backgroundColor: "white",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
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
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/icon.svg"
            alt="Rituels de Notes"
            width={32}
            height={32}
            priority
          />
        </div>
        <span
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

      {showSettings && (
        <Link
          href="/settings"
          style={{
            padding: "8px",
            backgroundColor: "#f3f4f6",
            borderRadius: "9999px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
          title="Paramètres"
        >
          <Settings size={20} color="#111827" />
        </Link>
      )}
    </header>
  );
}
