// The app icon's sun and gem, without its background tile; colours follow the theme tokens.
export function Logo({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="21 23 64 54" className={className}>
      <path className="fill-foreground" d="M70.39 36.78A26 26 0 1 0 70.39 63.22A14 14 0 0 1 70.39 36.78Z" />
      <circle className="fill-accent" cx="75" cy="50" r="9" />
    </svg>
  );
}
