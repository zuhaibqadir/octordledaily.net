import { useCallback, useEffect, useState } from 'react';
import type { GameSettings } from '../game/types';
import { DEFAULT_SETTINGS } from '../game/types';

const SETTINGS_KEY = 'octordle-settings';

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      theme: parsed.theme ?? DEFAULT_SETTINGS.theme,
      highContrast: parsed.highContrast ?? DEFAULT_SETTINGS.highContrast,
      animations: parsed.animations ?? DEFAULT_SETTINGS.animations,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function resolveTheme(theme: GameSettings['theme']): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') return theme;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function useSettings() {
  const [settings, setSettingsState] = useState<GameSettings>(loadSettings);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(loadSettings().theme),
  );

  const setSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const apply = () => setResolvedTheme(resolveTheme(settings.theme));
    apply();

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (settings.theme === 'system') apply();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [settings.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.highContrast = settings.highContrast ? 'true' : 'false';
    root.dataset.animations = settings.animations ? 'true' : 'false';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#12141a' : '#f4f5f7',
      );
    }
  }, [resolvedTheme, settings.highContrast, settings.animations]);

  return { settings, setSettings, resolvedTheme };
}
