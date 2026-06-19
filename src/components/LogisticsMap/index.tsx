import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdaptiveMode } from '../../hooks/useAdaptiveMode';
import { useLogisticsFilter } from '../../hooks/useLogisticsFilter';
import type { LogisticsMapProps, LogisticsMarker } from '../../data/types';
import { Marker } from './Marker';
import { MarkerPopup, PopupCard } from './MarkerPopup';
import { StationList } from './StationList';
import { Legend } from './Legend';
import { FilterBar } from './FilterBar';

export { Marker, MarkerPopup, PopupCard, StationList, Legend, FilterBar };

export function LogisticsMap({
  markers: markersProp,
  sceneConfig,
  showLegend = true,
  showFilter = true,
  onMarkerClick,
}: Omit<LogisticsMapProps, 'filterTypes' | 'onFilterChange'>) {
  const [adaptiveMode, setAdaptiveMode] = useAdaptiveMode(sceneConfig);
  const {
    filteredMarkers, filterTypes, allTypes, toggleType, resetFilter, stats,
  } = useLogisticsFilter(markersProp);

  const [selected, setSelected] = useState<LogisticsMarker | null>(null);

  const handleMarkerClick = useCallback((m: LogisticsMarker) => {
    setSelected((prev) => (prev?.id === m.id ? null : m));
    onMarkerClick?.(m);
  }, [onMarkerClick]);

  const sortedMarkers = useMemo(() => {
    const rank: Record<string, number> = { zone: 0, warehouse: 1, vehicle: 2, exception: 3 };
    return [...filteredMarkers].sort((a, b) => rank[a.type] - rank[b.type]);
  }, [filteredMarkers]);

  return (
    <div className="h-full w-full flex flex-col gap-3">
      {showFilter && (
        <FilterBar
          sceneConfig={sceneConfig}
          filterTypes={filterTypes}
          allTypes={allTypes}
          onToggle={toggleType}
          onReset={resetFilter}
          mode={adaptiveMode}
          onModeChange={setAdaptiveMode}
          canUseMap={sceneConfig.mapHasBaseLayer}
        />
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-3">
        <div className="relative min-h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${sceneConfig.backgroundGradient}`}
          />
          <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />

          {sceneConfig.id === 'coldChain' && adaptiveMode === 'map' && (
            <>
              <div className="absolute -left-20 top-1/4 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl animate-cold-fog pointer-events-none" />
              <div className="absolute right-10 bottom-10 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl animate-cold-fog pointer-events-none" style={{ animationDelay: '2s' }} />
            </>
          )}
          {sceneConfig.id === 'express' && adaptiveMode === 'map' && (
            <>
              <div className="absolute left-1/4 top-1/3 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-breath" />
              <div className="absolute right-1/4 bottom-1/4 w-56 h-56 rounded-full bg-amber-400/10 blur-3xl pointer-events-none animate-breath" style={{ animationDelay: '1.5s' }} />
            </>
          )}
          {sceneConfig.id === 'sameCity' && adaptiveMode === 'map' && (
            <>
              <div className="absolute left-1/3 top-1/3 w-56 h-56 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-breath" />
              <div className="absolute right-1/4 bottom-1/3 w-48 h-48 rounded-full bg-teal-400/10 blur-3xl pointer-events-none animate-breath" style={{ animationDelay: '1.2s' }} />
            </>
          )}

          {sceneConfig.mapHasBaseLayer && adaptiveMode === 'map' && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={sceneConfig.accentColorHex} stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                className="fill-white/[0.03] stroke-white/[0.08] stroke-[0.2]"
                d="M18,25 Q30,18 45,22 Q60,16 75,24 Q88,30 86,45 Q90,60 82,72 Q70,82 55,78 Q40,84 28,76 Q14,66 16,50 Q12,36 18,25 Z"
              />
              <path
                className="route-path"
                fill="none"
                stroke={sceneConfig.accentColorHex}
                strokeOpacity="0.35"
                strokeWidth="0.25"
                d="M68,26 L82,44 M82,44 L72,72 M68,26 L64,48 L72,72 M45,52 L64,48 M82,44 L45,52"
              />
              <g className="fill-white/30">
                <circle cx="22" cy="40" r="0.5" />
                <circle cx="38" cy="55" r="0.5" />
                <circle cx="58" cy="35" r="0.5" />
                <circle cx="78" cy="58" r="0.5" />
                <circle cx="52" cy="68" r="0.5" />
              </g>
            </svg>
          )}

          {!sceneConfig.mapHasBaseLayer && adaptiveMode === 'map' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                  style={{
                    background: `${sceneConfig.accentColorHex}15`,
                    border: `1px dashed ${sceneConfig.accentColorHex}55`,
                  }}
                >
                  <span className="font-display text-3xl opacity-60" style={{ color: sceneConfig.accentColorHex }}>
                    Ø
                  </span>
                </div>
                <p className="text-sm text-white/40">当前场景未配置地图底图</p>
                <p className="text-xs text-white/30 mt-1">已自动切换至列表视图</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {adaptiveMode === 'map' && sceneConfig.mapHasBaseLayer ? (
              <motion.div
                key="map-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
                onClick={() => setSelected(null)}
              >
                {sortedMarkers.map((m, i) => (
                  <Marker
                    key={m.id}
                    marker={m}
                    accentHex={sceneConfig.accentColorHex}
                    index={i}
                    onClick={handleMarkerClick}
                    isSelected={selected?.id === m.id}
                  />
                ))}
                <MarkerPopup
                  marker={selected}
                  onClose={() => setSelected(null)}
                  sceneConfig={sceneConfig}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 overflow-y-auto p-3"
              >
                <StationList
                  markers={filteredMarkers}
                  sceneConfig={sceneConfig}
                  onMarkerClick={handleMarkerClick}
                  selectedId={selected?.id ?? null}
                />
                {selected && (
                  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PopupCard
                        marker={selected}
                        onClose={() => setSelected(null)}
                        sceneConfig={sceneConfig}
                      />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto glass-light rounded-xl px-3 py-1.5 flex items-center gap-2 text-[10px] text-white/60">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: sceneConfig.accentColorHex }}
              />
              {sceneConfig.name} · 实时数据
            </div>
            <div className="pointer-events-auto glass-light rounded-xl px-3 py-1.5 text-[10px] text-white/60 font-mono">
              N:{stats.byType.warehouse} V:{stats.byType.vehicle} E:{stats.byType.exception} Z:{stats.byType.zone}
            </div>
          </div>
        </div>

        <div className="hidden xl:flex flex-col gap-3 min-h-0">
          {showLegend && <Legend sceneConfig={sceneConfig} stats={stats} />}
          <SideStatsCard
            sceneConfig={sceneConfig}
            totalMarkers={markersProp.length}
            dangerCount={stats.totalDanger}
          />
        </div>
      </div>
    </div>
  );
}

function SideStatsCard({
  sceneConfig, totalMarkers, dangerCount,
}: { sceneConfig: any; totalMarkers: number; dangerCount: number }) {
  const health = Math.max(0, Math.round(100 - (dangerCount / Math.max(1, totalMarkers)) * 220));
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="glass rounded-2xl p-4 shadow-xl flex-1"
    >
      <div className="text-[11px] text-white/60 font-medium mb-3 flex items-center gap-1.5">
        <span className="inline-block w-1 h-3.5 rounded-full" style={{ background: sceneConfig.accentColorHex }} />
        网络健康度
      </div>
      <div className="relative flex items-center justify-center py-4">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={sceneConfig.accentColorHex}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(health / 100) * 251.3} 251.3`}
            style={{ filter: `drop-shadow(0 0 6px ${sceneConfig.accentColorHex}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-3xl font-bold text-white leading-none">{health}</div>
          <div className="text-[10px] text-white/50 mt-1">综合指数</div>
        </div>
      </div>
      <div className="mt-2 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-white/60">节点总数</span>
          <span className="font-display font-semibold text-white">{totalMarkers}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">异常告警</span>
          <span className={`font-display font-semibold ${dangerCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {dangerCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">可用率</span>
          <span className="font-display font-semibold text-emerald-400">
            {Math.max(0, 100 - Math.round((dangerCount / Math.max(1, totalMarkers)) * 100 * 1.5))}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function MarkerPopupStandalone(props: React.ComponentProps<typeof MarkerPopup>) {
  return <div className="relative z-10"><MarkerPopup {...props} /></div>;
}
// avoid unused warning
void MarkerPopupStandalone;
