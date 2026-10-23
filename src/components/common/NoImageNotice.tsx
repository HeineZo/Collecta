import { ImageOff } from "lucide-react";

// Fills its container; colours and shape come from the caller.
export function NoImageNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`no-image-notice flex flex-col items-center justify-center gap-2 text-sm ${className}`}>
      <ImageOff aria-hidden className="size-8" strokeWidth={1.5} />
      No public image
    </div>
  );
}
