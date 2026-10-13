import type { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  className?: string;
  children: ReactNode;
}

// A titled block of the detail page ("Details", "Tags"…).
export function InfoSection({ title, className = "", children }: InfoSectionProps) {
  return (
    <section className={`info-section flex flex-col gap-3 md:gap-3.5 ${className}`}>
      <h2 className="text-xl font-medium tracking-tight md:text-[22px]">{title}</h2>
      {children}
    </section>
  );
}
