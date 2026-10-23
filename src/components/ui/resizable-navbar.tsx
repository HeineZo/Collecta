"use client";

// Vendored from Aceternity UI (https://ui.aceternity.com/components/resizable-navbar).

import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import React, { useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/cn";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    isActive: boolean;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  id?: string;
}

const FLOATING_SHADOW =
  "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset";

export const Navbar = ({ children, className, isDark = false }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        ref={ref}
        className={cn(
          "sticky inset-x-0 top-0 z-40 w-full",
          isDark && !visible && "dark text-foreground",
          className,
        )}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<{ visible?: boolean }>,
                { visible },
              )
            : child,
        )}
      </motion.header>
    </MotionConfig>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible ? FLOATING_SHADOW : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex",
        visible && "bg-background/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.nav
      aria-label="Main"
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <Link
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn(
            "relative px-4 py-2 text-muted transition-colors duration-200 hover:text-foreground",
            item.isActive && "text-foreground",
          )}
          aria-current={item.isActive ? "page" : undefined}
          key={`link-${idx}`}
          to={item.link}
        >
          {(hovered === idx || (hovered === null && item.isActive)) && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-default"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </Link>
      ))}
    </motion.nav>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible ? FLOATING_SHADOW : "none",
        width: visible ? "90%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between rounded-[2rem] bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-background/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  id,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          id={id}
          aria-label="Main"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{ boxShadow: FLOATING_SHADOW }}
          className={cn(
            "absolute inset-x-0 top-full z-50 mt-2 flex w-full flex-col items-stretch justify-start gap-1 rounded-[2rem] border border-border bg-overlay p-3",
            className,
          )}
        >
          {children}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
  controls,
  ref,
}: {
  isOpen: boolean;
  onClick: () => void;
  controls?: string;
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controls}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="-mr-2 rounded-full p-2 text-foreground"
    >
      {isOpen ? <X aria-hidden /> : <Menu aria-hidden />}
    </button>
  );
};
