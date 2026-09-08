import type { ToastMessage } from '../game/types';

interface ToastProps {
  toasts: ToastMessage[];
}

export function Toast({ toasts }: ToastProps) {
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className="toast" role="status">
          {t.text}
        </div>
      ))}
    </div>
  );
}
