import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Warehouse,
  Truck,
  AlertTriangle,
  Bike,
  Refrigerator,
  Package,
} from 'lucide-react';
import type { LogisticsMarker, MarkerType } from '../../data/types';
import { cn } from '../../lib/utils';

interface MarkerProps {
  marker: LogisticsMarker;
  accentHex: string;
  index: number;
  onClick: (m: LogisticsMarker) => void;
  isSelected: boolean;
}

const statusStyles: Record<string, { ring: string; bg: string; text: string; animate: boolean }> = {
  normal: { ring: 'ring-emerald-400/30', bg: 'bg-emerald-500', text: 'text-emerald-50', animate: true },
  warning: { ring: 'ring-amber-400/40', bg: 'bg-amber-500', text: 'text-amber-50', animate: true },
  danger: { ring: 'ring-red-500/60', bg: 'bg-red-500', text: 'text-red-50', animate: true },
  inactive: { ring: 'ring-slate-400/30', bg: 'bg-slate-500', text: 'text-slate-200', animate: false },
};

function iconFor(type: MarkerType, scene: string) {
  const sz = 16;
  const cls = 'drop-shadow-sm';
  switch (type) {
    case 'warehouse':
      if (scene === 'coldChain') return <Refrigerator size={sz} className={cls} />;
      return <Warehouse size={sz} className={cls} />;
    case 'vehicle':
      if (scene === 'sameCity') return <Bike size={sz} className={cls} />;
      return <Truck size={sz} className={cls} />;
    case 'exception':
      return <AlertTriangle size={sz} className={cls} />;
    case 'zone':
      return <Package size={sz} className={cls} />;
  }
}

const zoneGradient = {
  express: 'rgba(255, 107, 53, 0.18)',
  coldChain: 'rgba(6, 182, 212, 0.18)',
  sameCity: 'rgba(16, 185, 129, 0.18)',
};

const zoneBorder = {
  express: '#FF6B35',
  coldChain: '#06B6D4',
  sameCity: '#10B981',
};

function MarkerComponent({ marker, accentHex, index, onClick, isSelected }: MarkerProps) {
  const s = statusStyles[marker.status];
  const scene = marker.id.startsWith('cc-') ? 'coldChain'
    : marker.id.startsWith('sc-') ? 'sameCity'
    : 'express';

  if (marker.type === 'zone') {
    const z = marker;
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${z.coordinate.x}%`,
          top: `${z.coordinate.y}%`,
          width: 0,
          height: 0,
        }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: `${z.radius * 12}px`,
            height: `${z.radius * 12}px`,
            left: 0,
            top: 0,
            x: '-50%',
            y: '-50%',
            background: zoneGradient[scene],
            border: `1.5px dashed ${zoneBorder[scene]}`,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.7, 0.4, 0.7],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.04 * index, duration: 0.5 }}
          onClick={() => onClick(marker)}
          className="absolute cursor-pointer group"
          style={{ x: '-50%', y: '-50%' }}
        >
          <div
            className={cn(
              'relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110',
              'border',
            )}
            style={{
              background: `${accentHex}33`,
              borderColor: `${accentHex}99`,
              color: '#fff',
            }}
          >
            {iconFor('zone', scene)}
            {isSelected && (
              <span
                className="absolute -inset-1 rounded-full opacity-60 blur"
                style={{ background: accentHex }}
              />
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * index, duration: 0.45, ease: 'easeOut' }}
      className="absolute cursor-pointer"
      style={{
        left: `${marker.coordinate.x}%`,
        top: `${marker.coordinate.y}%`,
        zIndex: marker.status === 'danger' ? 20 : marker.status === 'warning' ? 15 : 10,
      }}
      onClick={() => onClick(marker)}
    >
      <div
        className="relative"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {s.animate && (
          <span
            className={cn(
              'absolute left-1/2 top-1/2 w-11 h-11 rounded-full',
              marker.status === 'danger' ? 'animate-danger-shake' : 'animate-halo-pulse',
            )}
            style={{
              boxShadow: `0 0 0 4px ${marker.status === 'danger'
                ? 'rgba(239, 68, 68, 0.35)'
                : marker.status === 'warning'
                ? 'rgba(245, 158, 11, 0.3)'
                : 'rgba(16, 185, 129, 0.28)'}`,
            }}
          />
        )}

        <div
          className={cn(
            'relative z-10 flex items-center justify-center w-9 h-9 rounded-xl shadow-xl border-2 transition-transform hover:scale-110',
            'ring-4', s.ring, s.bg, s.text,
            marker.status === 'danger' ? 'rotate-0' : '',
          )}
          style={{
            backdropFilter: 'blur(6px)',
          }}
        >
          {iconFor(marker.type, scene)}
          {isSelected && (
            <span className="absolute -inset-2 rounded-xl ring-2 ring-white/70 pointer-events-none" />
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          <div className="glass-light px-2 py-1 rounded-md text-[10px] text-white/90 font-medium shadow-lg">
            {marker.name.length > 10 ? marker.name.slice(0, 10) + '…' : marker.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const Marker = memo(MarkerComponent);
