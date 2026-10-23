import { SearchField } from "@heroui/react";
import { cn } from "../lib/cn";

const SIZE_CLASSES = {
  sm: "h-9 md:h-8",
  md: "h-10 md:h-9",
  lg: "h-11 md:h-10",
};

interface SearchBarProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  size?: keyof typeof SIZE_CLASSES;
  isProminent?: boolean;
}

export function SearchBar({ label, value, onChange, size = "md", isProminent = false }: SearchBarProps) {
  return (
    <SearchField aria-label={label} value={value} onChange={onChange} fullWidth>
      {/* A neutral border marks focus instead of HeroUI's accent ring. */}
      <SearchField.Group
        className={cn(
          "focus-within:border-muted focus-within:ring-0",
          SIZE_CLASSES[size],
          isProminent && "h-14 rounded-full px-3 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.18)] md:h-16 md:px-4",
        )}
      >
        <SearchField.SearchIcon className={isProminent ? "size-5" : undefined} />
        <SearchField.Input
          placeholder={label}
          className={cn(size === "lg" && "sm:text-base", isProminent && "text-base md:text-lg")}
        />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
