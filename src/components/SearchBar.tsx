import { SearchField } from "@heroui/react";

interface SearchBarProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ label, value, onChange, className }: SearchBarProps) {
  return (
    <SearchField aria-label={label} value={value} onChange={onChange} className={className} fullWidth>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder={label} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
