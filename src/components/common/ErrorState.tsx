import { Button } from "@heroui/react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="error-state flex flex-col items-start gap-3 rounded-3xl bg-surface p-6">
      <p>{message}</p>
      <Button variant="outline" onPress={onRetry}>
        Try again
      </Button>
    </div>
  );
}
