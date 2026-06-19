import { useEffect, useState } from 'react';
import type { SceneConfig } from '../data/types';

type Mode = 'map' | 'list';

const STORAGE_KEY = 'logistics-map-mode';

export function useAdaptiveMode(sceneConfig: SceneConfig, defaultMode?: Mode): [Mode, (mode: Mode) => void] {
  const getInitialMode = (): Mode => {
    if (typeof window === 'undefined') return defaultMode ?? 'map';
    const saved = sessionStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === 'map' || saved === 'list') return saved;
    if (!sceneConfig.mapHasBaseLayer) return 'list';
    if (window.innerWidth < 768) return 'list';
    return defaultMode ?? 'map';
  };

  const [mode, setMode] = useState<Mode>(getInitialMode);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768 && mode === 'map' && !sceneConfig.mapHasBaseLayer) {
        setMode('list');
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mode, sceneConfig.mapHasBaseLayer]);

  useEffect(() => {
    if (!sceneConfig.mapHasBaseLayer) {
      setMode('list');
    }
  }, [sceneConfig.mapHasBaseLayer]);

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    try {
      sessionStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      /* ignore storage errors */
    }
  };

  return [mode, changeMode];
}
