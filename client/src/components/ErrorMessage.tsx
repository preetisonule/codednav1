import { AlertTriangle, RotateCcw, UserX, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  status?: number;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ status, message, onRetry }: ErrorMessageProps) {
  const Icon = status === 404 ? UserX : status === 0 ? WifiOff : AlertTriangle;
  const title = status === 404 ? 'User not found' : status === 0 ? 'Connection problem' : 'Something went wrong';

  return (
    <div className="glass-card mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
        <Icon size={22} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="gradient-button mt-2">
          <RotateCcw size={15} /> Try again
        </button>
      )}
    </div>
  );
}
