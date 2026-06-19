import { motion } from 'framer-motion';
import { Warehouse, Truck, Bike, AlertTriangle, CircleDot, Refrigerator } from 'lucide-react';
import type { MarkerType, SceneConfig } from '../../data/types';
import { cn } from '../../lib/utils';

interface LegendProps {
  sceneConfig: SceneConfig;
  stats: {
    byType: Record<MarkerType, number>;
    dangerByType: Record<MarkerType, number>;
  };
}

const typeMeta: Record<MarkerType, { label: string; sceneLabels: Record<string, string> }> = {
  warehouse: { label: '仓库', sceneLabels: { express: '分拨中心', coldChain: '冷库', sameCity: '前置仓' } },
  vehicle: { label: '车辆', sceneLabels: { express: '干线车辆', coldChain: '冷藏车', sameCity: '骑手' } },
  exception: { label: '异常', sceneLabels: { express: '异常包裹', coldChain: '温控异常', sameCity: '异常订单' } },
  zone: { label: '范围', sceneLabels: { express: '服务区', coldChain: '冷链覆盖', sameCity: '配送圈' } },
};

function typeIcon(type: MarkerType, scene: string) {
  const props = { size: 14, strokeWidth: 2.2 };
  if (type === 'warehouse') return scene === 'coldChain' ? <Refrigerator {...props} /> : <Warehouse {...props} />;
  if (type === 'vehicle') return scene === 'sameCity' ? <Bike {...props} /> : <Truck {...props} />;
  if (type === 'exception') return <AlertTriangle {...props} />;
  return <CircleDot {...props} />;
}

const typeColor: Record<MarkerType, string> = {
  warehouse: '#60A5FA',
  vehicle: '#A78BFA',
  exception: '#F87171',
  zone: '#34D399',
};

export function Legend({ sceneConfig, stats }: LegendProps) {
  const items: MarkerType[] = ['warehouse', 'vehicle', 'exception', 'zone'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="glass rounded-2xl p-3.5 shadow-xl"
    >
      <div className="text-[11px] text-white/60 font-medium mb-2.5 flex items-center gap-1.5">
        <span className="inline-block w-1 h-3.5 rounded-full" style={{ background: sceneConfig.accentColorHex }} />
        图例统计
      </div>
      <div className="space-y-2">
        {items.map((t, i) => {
          const count = stats.byType[t];
          const danger = stats.dangerByType[t];
          const label = typeMeta[t].sceneLabels[sceneConfig.id] ?? typeMeta[t].label;
          return (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center border',
                )}
                style={{
                  background: `${typeColor[t]}22`,
                  borderColor: `${typeColor[t]}55`,
                  color: typeColor[t],
                }}
              >
                {typeIcon(t, sceneConfig.id)}
              </span>
              <span className="flex-1 text-xs text-white/80">{label}</span>
              <span className="font-display font-semibold text-white text-xs">{count}</span>
              {danger > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-semibold border border-red-400/30">
                  {danger}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
