import { buttonVariants } from "@heroui/styles";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

interface ExternalLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

// A link to another site
export function ExternalLinkButton({
  href,
  children,
  className = "",
}: ExternalLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`external-link-button ${buttonVariants({ size: "lg" })} ${className}`}
    >
      {children}
      <ExternalLink aria-hidden className="size-4.5" />
    </a>
  );
}
