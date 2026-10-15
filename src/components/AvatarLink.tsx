import { buttonVariants } from "@heroui/styles";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface AvatarLinkProps {
  href: string;
  avatarSrc: string;
  children: ReactNode;
  className?: string;
}

export function AvatarLink({ href, avatarSrc, children, className }: AvatarLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "avatar-link group relative z-20 rounded-full ps-1.5 hover:text-accent-foreground [--button-bg-hover:var(--accent)] [--button-bg-pressed:var(--accent-hover)]",
        buttonVariants({ variant: "tertiary" }),
        className,
      )}
    >
      <span className="avatar-link__avatar relative size-7 shrink-0 transition-transform duration-200 group-hover:scale-125 group-hover:-rotate-8 motion-reduce:transition-none">
        <img src={avatarSrc} alt="" className="absolute bottom-0 left-1/2 w-8 max-w-none -translate-x-1/2" />
      </span>
      {children}
    </a>
  );
}
