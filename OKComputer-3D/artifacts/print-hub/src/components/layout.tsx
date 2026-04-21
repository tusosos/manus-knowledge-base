import React from "react";
import { AppSidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground dark">
      <a href="#main-content" className="skip-to-content">
        Przejdz do tresci
      </a>
      <AppSidebar />
      <main id="main-content" className="flex-1 overflow-y-auto bg-grid-pattern" tabIndex={-1}>
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
