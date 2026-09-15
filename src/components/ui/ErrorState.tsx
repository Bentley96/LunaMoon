import { AlertCircle } from 'lucide-react';

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <AlertCircle className="h-8 w-8 text-blush-600" aria-hidden="true" />
      <p className="max-w-md text-ink-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline-ink">
          Try again
        </button>
      )}
    </div>
  );
}
