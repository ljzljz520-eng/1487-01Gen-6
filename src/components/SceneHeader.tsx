import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { SceneConfig } from '../data/types';

interface SceneHeaderProps {
  sceneConfig: SceneConfig;
}

const gradMap: Record<string, string> = {
  express: 'gradient-text-express',
  coldChain: 'gradient-text-cold',
  sameCity: 'gradient-text-city',
};

export function SceneHeader({ sceneConfig }: SceneHeaderProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl glass-light text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="返回首页"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className={`font-display font-bold text-xl sm:text-2xl ${gradMap[sceneConfig.id] ?? 'text-white'} truncate`}>
              {sceneConfig.name}
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-0.5 font-display tracking-wide uppercase">
            {sceneConfig.subtitle}
          </p>
        </div>
      </div>

      <div className="sm:ml-auto flex items-center gap-2">
        <div className="flex items-center gap-2 glass-light rounded-2xl px-3 py-2 max-w-md">
          <Info size={14} className="shrink-0 text-white/40" />
          <p className="text-xs text-white/60 leading-snug line-clamp-2">
            {sceneConfig.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
