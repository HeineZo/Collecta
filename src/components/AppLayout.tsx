import type { ReactNode } from "react";
import { AppFooter } from "./AppFooter";
import { AppNavbar } from "./AppNavbar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout flex min-h-dvh flex-col overflow-x-clip bg-background text-foreground">
      <AppNavbar />
      <main className="app-layout__content mx-auto w-full max-w-[1200px] flex-1 px-6 pb-16 pt-8 md:px-10 md:pt-16">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
