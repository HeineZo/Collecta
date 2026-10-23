import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ArrowLink({ href, children, className }: ArrowLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn("arrow-link group inline-flex items-center gap-1 transition-colors hover:text-foreground", className)}
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}
