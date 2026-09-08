import { useEffect } from 'react';

interface UseKeyboardOptions {
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  enabled?: boolean;
}

export function useKeyboard({
  onLetter,
  onEnter,
  onBackspace,
  enabled = true,
}: UseKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        onEnter();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        onBackspace();
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        onLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onLetter, onEnter, onBackspace, enabled]);
}
