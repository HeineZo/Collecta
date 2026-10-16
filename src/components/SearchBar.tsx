import { SearchField } from "@heroui/react";
import { cn } from "../lib/cn";

interface SearchBarProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isProminent?: boolean;
}

export function SearchBar({ label, value, onChange, isProminent = false }: SearchBarProps) {
  return (
    <SearchField aria-label={label} value={value} onChange={onChange} fullWidth>
      {/* A neutral border marks focus instead of HeroUI's accent ring. */}
      <SearchField.Group
        className={cn(
          "focus-within:border-muted focus-within:ring-0",
          isProminent && "h-14 rounded-full px-3 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.18)] md:h-16 md:px-4",
        )}
      >
        <SearchField.SearchIcon className={isProminent ? "size-5" : undefined} />
        <SearchField.Input placeholder={label} className={isProminent ? "text-base md:text-lg" : undefined} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
