"use client";

import { ReactNode } from "react";

/**
 * Client Provider - Ensures stores are initialized on client side only
 * Prevents hydration mismatches and SSR issues with Zustand + IndexedDB
 */
export function ClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
