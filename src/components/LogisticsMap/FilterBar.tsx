import { Warehouse, Truck, Bike, AlertTriangle, CircleDot, Refrigerator, RotateCcw } from 'lucide-react';
import type { MarkerType, SceneConfig } from '../../data/types';
import { cn } from '../../lib/utils';

interface FilterBarProps {
  sceneConfig: SceneConfig;
  filterTypes: MarkerType[];
  allTypes: MarkerType[];
  onToggle: (t: MarkerType) => void;
  onReset: () => void;
  mode: 'map' | 'list';
  onModeChange: (m: 'map' | 'list') => void;
  canUseMap: boolean;
}

const typeMeta: Record<MarkerType, { label: string; sceneLabels: Record<string, string> }> = {
  warehouse: { label: '仓库', sceneLabels: { express: '分拨中心', coldChain: '冷库', sameCity: '前置仓' } },
  vehicle: { label: '车辆', sceneLabels: { express: '车辆', coldChain: '冷藏车', sameCity: '骑手' } },
  exception: { label: '异常', sceneLabels: { express: '异常', coldChain: '异常', sameCity: '异常' } },
  zone: { label: '范围', sceneLabels: { express: '服务区', coldChain: '覆盖区', sameCity: '配送圈' } },
};

function typeIcon(type: MarkerType, scene: string, active: boolean) {
  const props = { size: 14, strokeWidth: 2 };
  const cls = active ? '' : 'opacity-60';
  if (type === 'warehouse') return scene === 'coldChain' ? <Refrigerator {...props} className={cls} /> : <Warehouse {...props} className={cls} />;
  if (type === 'vehicle') return scene === 'sameCity' ? <Bike {...props} className={cls} /> : <Truck {...props} className={cls} />;
  if (type === 'exception') return <AlertTriangle {...props} className={cls} />;
  return <CircleDot {...props} className={cls} />;
}

export function FilterBar({
  sceneConfig, filterTypes, allTypes, onToggle, onReset, mode, onModeChange, canUseMap,
}: FilterBarProps) {
  const accent = sceneConfig.accentColorHex;
  const allActive = filterTypes.length === allTypes.length;

  return (
    <div className="glass rounded-2xl px-3 py-2.5 flex items-center gap-2 flex-wrap shadow-xl">
      <div className="flex items-center gap-1 pr-3 mr-1 border-r border-white/10">
        <span
          className="text-[11px] font-medium text-white/60"
          style={{ color: `${accent}cc` }}
        >
          筛选
        </span>
      </div>
      <div className="flex items-center gap-1">
        {allTypes.map((t) => {
          const active = filterTypes.includes(t);
          const label = typeMeta[t].sceneLabels[sceneConfig.id] ?? typeMeta[t].label;
          return (
            <button
              key={t}
              onClick={() => onToggle(t)}
              className={cn(
                'group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all',
                active
                  ? 'text-white shadow-md'
                  : 'text-white/40 hover:text-white/70',
              )}
              style={active ? {
                background: `${accent}33`,
                border: `1px solid ${accent}80`,
                boxShadow: `0 0 12px ${accent}22`,
              } : {
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {typeIcon(t, sceneConfig.id, active)}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {!allActive && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-colors ml-1"
        >
          <RotateCcw size={12} />
          重置
        </button>
      )}

      <div className="ml-auto flex items-center gap-0.5 p-0.5 rounded-xl border border-white/10 bg-white/5">
        <button
          onClick={() => canUseMap && onModeChange('map')}
          disabled={!canUseMap}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            mode === 'map' ? 'text-white' : 'text-white/50 hover:text-white/80',
            !canUseMap && 'opacity-40 cursor-not-allowed',
          )}
          style={mode === 'map' ? {
            background: `${accent}40`,
            boxShadow: `inset 0 0 0 1px ${accent}80`,
          } : {}}
        >
          <CircleDot size={13} />
          地图
          {!canUseMap && <span className="text-[9px] opacity-70">(无底图)</span>}
        </button>
        <button
          onClick={() => onModeChange('list')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            mode === 'list' ? 'text-white' : 'text-white/50 hover:text-white/80',
          )}
          style={mode === 'list' ? {
            background: `${accent}40`,
            boxShadow: `inset 0 0 0 1px ${accent}80`,
          } : {}}
        >
          <Warehouse size={13} />
          列表
        </button>
      </div>
    </div>
  );
}
