import { useCallback, useRef, useState } from 'react';
import type { ToastMessage } from '../game/types';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    (text: string, duration = 1800) => {
      const id = ++toastId;
      setToasts((prev) => [...prev.slice(-2), { id, text, duration }]);
      const timer = window.setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  return { toasts, showToast, dismiss };
}
