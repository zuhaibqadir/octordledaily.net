import { useEffect, useState, type RefObject } from 'react';

/**
 * Keeps the game play area within the viewport by writing
 * --game-board-h based on measured available space.
 */
export function useGameLayout(
  shellRef: RefObject<HTMLElement | null>,
  _playRef: RefObject<HTMLElement | null>,
) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const update = () => {
      const header = document.querySelector('.site-header');
      const headerH = header?.getBoundingClientRect().height ?? 52;
      const status = shell.querySelector('.game-status-bar');
      const keyboard = shell.querySelector('.keyboard');
      const statusH = status?.getBoundingClientRect().height ?? 28;
      const keyH = keyboard?.getBoundingClientRect().height ?? 140;
      const padding = 24;
      const available = Math.max(
        160,
        window.innerHeight - headerH - statusH - keyH - padding,
      );
      shell.style.setProperty('--game-board-h', `${Math.floor(available)}px`);
      setReady(true);
    };

    update();
    // Recalculate after layout settles (keyboard measured)
    const t = window.setTimeout(update, 50);
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [shellRef]);

  return ready;
}
