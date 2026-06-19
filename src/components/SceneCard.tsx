import { Truck, Snowflake, Bike, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { SceneConfig } from '../data/types';

interface SceneCardProps {
  scene: SceneConfig;
  index: number;
}

const iconMap = {
  Truck,
  Snowflake,
  Bike,
};

const gradMap: Record<string, { btn: string; border: string; ring: string; grad: string }> = {
  express: {
    btn: 'from-[#FF6B35]',
    border: 'border-[#FF6B35]/40',
    ring: 'ring-[#FF6B35]/30',
    grad: 'from-[#FF6B35] via-[#FFB547]',
  },
  coldChain: {
    btn: 'from-[#06B6D4]',
    border: 'border-[#06B6D4]/40',
    ring: 'ring-[#06B6D4]/30',
    grad: 'from-[#06B6D4] via-[#3B82F6]',
  },
  sameCity: {
    btn: 'from-[#10B981]',
    border: 'border-[#10B981]/40',
    ring: 'ring-[#10B981]/30',
    grad: 'from-[#10B981] via-[#34D399]',
  },
};

export function SceneCard({ scene, index }: SceneCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[scene.icon];
  const routeMap: Record<string, string> = {
    express: '/express',
    coldChain: '/cold-chain',
    sameCity: '/same-city',
  };
  const c = gradMap[scene.id] ?? gradMap.express;
  const route = routeMap[scene.id];

  return (
    <motion.button
      onClick={() => navigate(route)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className="group relative text-left w-full h-full glass rounded-3xl p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:shadow-2xl focus:outline-none focus-visible:ring-2"
      style={{
        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-30 blur-3xl bg-gradient-to-br ${c.grad} group-hover:opacity-50 transition-opacity duration-500`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl border ${c.border} bg-white/5 backdrop-blur-sm ring-1 ${c.ring} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon size={26} className="text-white drop-shadow-md" style={{ color: scene.accentColorHex }} />
          </div>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white/50 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 transition-all">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-bold text-white text-2xl tracking-tight">
            {scene.name}
          </h3>
          <p className="font-display text-sm tracking-widest uppercase opacity-60" style={{ color: scene.accentColorHex }}>
            {scene.subtitle}
          </p>
        </div>

        <p className="mt-5 text-sm text-white/65 leading-relaxed line-clamp-3">
          {scene.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-slate-900/80 bg-gradient-to-br"
                style={{
                  background: `linear-gradient(135deg, ${scene.accentColorHex}cc, ${scene.accentColorHex}55)`,
                }}
              />
            ))}
            <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-slate-900/80 bg-white/10 text-[10px] font-semibold text-white/80">
              +9
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r"
            style={{
              background: `linear-gradient(135deg, ${scene.accentColorHex}, ${scene.accentColorHex}cc`,
              boxShadow: `0 6px 20px -6px ${scene.accentColorHex}66`,
            }}
          >
            进入场景
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
