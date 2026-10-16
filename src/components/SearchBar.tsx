import { SearchField } from "@heroui/react";

interface SearchBarProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isProminent?: boolean;
}

export function SearchBar({ label, value, onChange, className, isProminent = false }: SearchBarProps) {
  return (
    <SearchField aria-label={label} value={value} onChange={onChange} className={className} fullWidth>
      <SearchField.Group
        className={
          isProminent
            ? "h-14 rounded-full px-3 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.18)] focus-within:border-muted focus-within:ring-0 md:h-16 md:px-4"
            : undefined
        }
      >
        <SearchField.SearchIcon className={isProminent ? "size-5" : undefined} />
        <SearchField.Input placeholder={label} className={isProminent ? "text-base md:text-lg" : undefined} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
