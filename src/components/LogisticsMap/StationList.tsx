import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Warehouse,
  Truck,
  Bike,
  AlertTriangle,
  CircleDot,
  Refrigerator,
  Clock,
  Gauge,
  Thermometer,
} from 'lucide-react';
import type { LogisticsMarker, MarkerType, SceneConfig } from '../../data/types';
import { cn } from '../../lib/utils';

interface StationListProps {
  markers: LogisticsMarker[];
  sceneConfig: SceneConfig;
  onMarkerClick: (m: LogisticsMarker) => void;
  selectedId: string | null;
}

const typeMeta: Record<MarkerType, { label: string; sceneLabels: Record<string, string> }> = {
  warehouse: { label: '仓库', sceneLabels: { express: '分拨中心', coldChain: '冷库', sameCity: '前置仓' } },
  vehicle: { label: '车辆', sceneLabels: { express: '干线车辆', coldChain: '冷藏车', sameCity: '骑手' } },
  exception: { label: '异常', sceneLabels: { express: '异常包裹', coldChain: '温控异常', sameCity: '异常订单' } },
  zone: { label: '范围', sceneLabels: { express: '服务区', coldChain: '冷链覆盖', sameCity: '配送圈' } },
};

const statusStyles = {
  normal: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  inactive: 'bg-slate-500',
};

const typeColor: Record<MarkerType, string> = {
  warehouse: '#60A5FA',
  vehicle: '#A78BFA',
  exception: '#F87171',
  zone: '#34D399',
};

function typeIcon(type: MarkerType, scene: string, size = 16) {
  const p = { size, strokeWidth: 2 };
  if (type === 'warehouse') return scene === 'coldChain' ? <Refrigerator {...p} /> : <Warehouse {...p} />;
  if (type === 'vehicle') return scene === 'sameCity' ? <Bike {...p} /> : <Truck {...p} />;
  if (type === 'exception') return <AlertTriangle {...p} />;
  return <CircleDot {...p} />;
}

function formatAgo(iso: string) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}

function markerSubtitle(m: LogisticsMarker): string {
  switch (m.type) {
    case 'warehouse': {
      const pct = Math.round((m.capacityUsed / m.capacity) * 100);
      const temp = typeof m.temperature === 'number' ? ` · ${m.temperature.toFixed(1)}℃` : '';
      return `容量 ${pct}% · 在岗 ${m.staffCount} 人${temp}`;
    }
    case 'vehicle': {
      const pct = Math.round((m.loadWeight / m.maxWeight) * 100);
      const sp = typeof m.speed === 'number' ? ` · ${m.speed} km/h` : '';
      return `${m.driverName} · 载重 ${pct}%${sp}`;
    }
    case 'exception':
      return `单号 ${m.trackingNo.slice(0, 10)}… · 严重度 ${m.severity}`;
    case 'zone': {
      const h = Math.floor(m.slaMinutes / 60);
      const mm = m.slaMinutes % 60;
      return `SLA ${h > 0 ? h + '小时' : ''}${mm > 0 ? mm + '分钟' : ''} · 覆盖 ${m.coverageCount.toLocaleString()}`;
    }
  }
}

export function StationList({ markers, sceneConfig, onMarkerClick, selectedId }: StationListProps) {
  const accent = sceneConfig.accentColorHex;
  const scene = sceneConfig.id;

  const groups = useMemo(() => {
    const order: MarkerType[] = ['warehouse', 'vehicle', 'exception', 'zone'];
    return order.map((t) => ({
      type: t,
      items: markers.filter((m) => m.type === t).sort((a, b) => {
        const rank = { danger: 0, warning: 1, normal: 2, inactive: 3 } as const;
        return rank[a.status] - rank[b.status];
      }),
    })).filter((g) => g.items.length > 0);
  }, [markers]);

  const [collapsed, setCollapsed] = useState<Record<MarkerType, boolean>>({
    warehouse: false, vehicle: false, exception: false, zone: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col gap-2 p-1"
    >
      {groups.map((g, gi) => {
        const label = typeMeta[g.type].sceneLabels[scene] ?? typeMeta[g.type].label;
        const isCollapsed = collapsed[g.type];
        const dangerCount = g.items.filter((i) => i.status === 'danger').length;
        return (
          <div key={g.type} className="glass rounded-2xl overflow-hidden shadow-lg">
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [g.type]: !c[g.type] }))}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0"
                style={{
                  background: `${typeColor[g.type]}22`,
                  borderColor: `${typeColor[g.type]}66`,
                  color: typeColor[g.type],
                }}
              >
                {typeIcon(g.type, scene)}
              </span>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-white text-sm">{label}</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-white/70 border border-white/10">
                    {g.items.length}
                  </span>
                  {dangerCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-red-500/15 text-red-300 border border-red-400/30">
                      {dangerCount} 异常
                    </span>
                  )}
                </div>
              </div>
              {isCollapsed ? (
                <ChevronRight size={16} className="text-white/50" />
              ) : (
                <ChevronDown size={16} className="text-white/50" />
              )}
            </button>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    {g.items.map((m, i) => {
                      const selected = m.id === selectedId;
                      return (
                        <motion.button
                          key={m.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: gi * 0.04 + i * 0.02, duration: 0.25 }}
                          onClick={() => onMarkerClick(m)}
                          className={cn(
                            'w-full text-left px-4 py-3 pl-[76px] relative flex items-start gap-3 transition-colors',
                            selected ? 'bg-white/10' : 'hover:bg-white/5',
                          )}
                          style={selected ? {
                            boxShadow: `inset 3px 0 0 ${accent}`,
                          } : {}}
                        >
                          <span
                            className={cn(
                              'absolute left-[56px] top-4 w-2 h-2 rounded-full',
                              statusStyles[m.status],
                              m.status === 'danger' && 'animate-pulse',
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <h5 className="font-medium text-white text-sm truncate">{m.name}</h5>
                              <span className="shrink-0 flex items-center gap-1 text-[10px] text-white/50 whitespace-nowrap">
                                <Clock size={10} />
                                {formatAgo(m.updatedAt)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-white/60 truncate">{markerSubtitle(m)}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {groups.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-white/40 py-16">
          <CircleDot size={32} className="mb-3 opacity-40" />
          <p className="text-sm">没有匹配的站点</p>
          <p className="text-xs mt-1">请调整筛选条件</p>
        </div>
      )}

      <div className="mt-auto pt-2 text-[10px] text-white/40 flex items-center justify-between px-2">
        <span className="flex items-center gap-1"><Gauge size={10} /> 共 {markers.length} 个节点</span>
        <span>
          <Thermometer size={10} className="inline mr-1" />
          列表模式（无地图底图自动降级）
        </span>
      </div>
    </motion.div>
  );
}
