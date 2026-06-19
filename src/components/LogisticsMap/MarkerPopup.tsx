import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Warehouse,
  Truck,
  Bike,
  Refrigerator,
  AlertTriangle,
  CircleDot,
  Users,
  Gauge,
  Thermometer,
  Package,
  CalendarClock,
  ShieldAlert,
  User,
  Hash,
  Target,
  Clock,
  FileText,
} from 'lucide-react';
import type { LogisticsMarker, SceneConfig } from '../../data/types';
import { cn } from '../../lib/utils';

interface MarkerPopupProps {
  marker: LogisticsMarker | null;
  onClose: () => void;
  sceneConfig: SceneConfig;
}

interface PopupCardProps {
  marker: LogisticsMarker;
  onClose: () => void;
  sceneConfig: SceneConfig;
}

const statusBadge = {
  normal: { text: '运行中', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30' },
  warning: { text: '注意', cls: 'bg-amber-500/15 text-amber-400 border-amber-400/30' },
  danger: { text: '异常', cls: 'bg-red-500/15 text-red-400 border-red-400/30' },
  inactive: { text: '离线', cls: 'bg-slate-500/15 text-slate-400 border-slate-400/30' },
};

const severityLabel: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '紧急',
};

const exceptionTypeLabel: Record<string, string> = {
  damaged: '货损/破损',
  lost: '丢失',
  delayed: '延误',
  temperature: '温控异常',
  other: '其他',
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 0) {
    const abs = -diffSec;
    if (abs < 3600) return `${Math.ceil(abs / 60)} 分钟后`;
    return `${Math.ceil(abs / 3600)} 小时后`;
  }
  if (diffSec < 60) return `${diffSec} 秒前`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟前`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时前`;
  return `${Math.floor(diffSec / 86400)} 天前`;
}

function formatFull(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', { hour12: false });
}

function progressPct(used: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

type Stat = { icon: any; label: string; value: React.ReactNode };

function usePopupHeadIcon(marker: LogisticsMarker | null, scene: string) {
  return useMemo(() => {
    if (!marker) return null;
    if (marker.type === 'warehouse') return scene === 'coldChain' ? Refrigerator : Warehouse;
    if (marker.type === 'vehicle') return scene === 'sameCity' ? Bike : Truck;
    if (marker.type === 'exception') return AlertTriangle;
    return CircleDot;
  }, [marker, scene]);
}

function usePopupStats(marker: LogisticsMarker | null, accent: string, scene: string): Stat[] {
  return useMemo(() => {
    if (!marker) return [];
    if (marker.type === 'warehouse') {
      const pct = progressPct(marker.capacityUsed, marker.capacity);
      const list: Stat[] = [
        { icon: Package, label: '容量使用率', value: (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">{marker.capacityUsed.toLocaleString()} / {marker.capacity.toLocaleString()}</span>
              <span className="font-display font-semibold text-white">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: pct >= 90 ? 'linear-gradient(90deg,#F59E0B,#EF4444)' : `linear-gradient(90deg,${accent},#ffffffaa)`,
                }}
              />
            </div>
          </div>
        ) },
        { icon: Users, label: '在岗人员', value: <span className="font-display font-semibold">{marker.staffCount} 人</span> },
      ];
      if (typeof marker.temperature === 'number') {
        const tempColor = marker.temperature > 4 ? '#F59E0B' : marker.temperature < -15 ? '#60A5FA' : '#10B981';
        list.push({
          icon: Thermometer,
          label: '当前温度',
          value: <span className="font-display font-semibold" style={{ color: tempColor }}>{marker.temperature.toFixed(1)} ℃</span>,
        });
      }
      return list;
    }
    if (marker.type === 'vehicle') {
      const loadPct = progressPct(marker.loadWeight, marker.maxWeight);
      const list: Stat[] = [
        { icon: User, label: scene === 'sameCity' ? '骑手' : '司机', value: marker.driverName },
        { icon: Hash, label: scene === 'sameCity' ? '工号' : '车牌', value: marker.vehicleNo },
        { icon: Package, label: '载重', value: (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">{marker.loadWeight}t / {marker.maxWeight}t</span>
              <span className="font-display font-semibold text-white">{loadPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${loadPct}%`, background: accent }} />
            </div>
          </div>
        ) },
      ];
      if (typeof marker.speed === 'number') {
        list.push({
          icon: Gauge,
          label: scene === 'sameCity' ? '骑行速度' : '行驶速度',
          value: <span className="font-display font-semibold">{marker.speed} km/h</span>,
        });
      }
      if (marker.eta) {
        list.push({ icon: CalendarClock, label: scene === 'sameCity' ? '预计送达' : '预计到达', value: formatTime(marker.eta) });
      }
      return list;
    }
    if (marker.type === 'exception') {
      return [
        { icon: Hash, label: '运单号', value: <span className="font-mono text-xs text-white/90 break-all">{marker.trackingNo}</span> },
        { icon: ShieldAlert, label: '异常类型', value: exceptionTypeLabel[marker.exceptionType] },
        { icon: Target, label: '严重等级', value: (
          <span className={cn(
            'px-2 py-0.5 rounded-md text-xs font-medium border inline-block',
            marker.severity === 'critical' ? 'bg-red-500/20 text-red-300 border-red-400/40'
              : marker.severity === 'high' ? 'bg-orange-500/20 text-orange-300 border-orange-400/40'
              : marker.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
              : 'bg-slate-500/20 text-slate-300 border-slate-400/40',
          )}>{severityLabel[marker.severity]}</span>
        ) },
        { icon: User, label: '处理人', value: marker.handler ?? '未分配' },
      ];
    }
    if (marker.type === 'zone') {
      const hours = Math.floor(marker.slaMinutes / 60);
      const mins = marker.slaMinutes % 60;
      return [
        { icon: Target, label: '半径', value: <span className="font-display font-semibold">~{marker.radius} km</span> },
        { icon: Clock, label: 'SLA 时效', value: <span className="font-display font-semibold">{hours > 0 ? `${hours}小时` : ''}{mins > 0 ? `${mins}分钟` : ''}</span> },
        { icon: Package, label: '覆盖订单量', value: <span className="font-display font-semibold">{marker.coverageCount.toLocaleString()}</span> },
      ];
    }
    return [];
  }, [marker, accent, scene]);
}

export function PopupCard({ marker, onClose, sceneConfig }: PopupCardProps) {
  const scene = sceneConfig.id;
  const accent = sceneConfig.accentColorHex;
  const headIcon = usePopupHeadIcon(marker, scene);
  const stats = usePopupStats(marker, accent, scene);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!headIcon) return null;

  return (
    <div className="w-full max-w-[360px] rounded-2xl shadow-2xl glass overflow-hidden">
      <div
        className="relative px-4 py-3.5 flex items-start gap-3 border-b"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          background: `linear-gradient(135deg, ${accent}22 0%, transparent 70%)`,
        }}
      >
        <div
          className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border"
          style={{ background: `${accent}33`, borderColor: `${accent}88`, color: '#fff' }}
        >
          {(() => { const Icon = headIcon; return <Icon size={20} />; })()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display font-semibold text-white text-base leading-tight truncate">
              {marker.name}
            </h4>
            <span
              className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{ borderColor: `${accent}66`, color: '#fff', background: `${accent}22` }}
            >
              {marker.type === 'warehouse' ? '仓库'
                : marker.type === 'vehicle' ? (scene === 'sameCity' ? '骑手' : '车辆')
                : marker.type === 'exception' ? '异常'
                : '配送范围'}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium border', statusBadge[marker.status].cls)}>
              {statusBadge[marker.status].text}
            </span>
            <span className="text-[11px] text-white/50 flex items-center gap-1">
              <Clock size={10} /> {formatTime(marker.updatedAt)} 更新
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 -m-1 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="关闭"
        >
          <X size={14} />
        </button>
      </div>

      {marker.description && (
        <div className="px-4 py-3 border-b border-white/5 flex items-start gap-2">
          <FileText size={12} className="text-white/40 mt-0.5 shrink-0" />
          <p className="text-xs text-white/75 leading-relaxed">{marker.description}</p>
        </div>
      )}

      <div className="px-4 py-4 grid grid-cols-2 gap-x-4 gap-y-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={cn('min-w-0', i % 2 === 1 ? 'text-right' : '')}>
              <div className={cn('flex items-center gap-1.5 text-[10px] text-white/50 mb-1.5', i % 2 === 1 ? 'justify-end' : '')}>
                <Icon size={11} />
                <span>{s.label}</span>
              </div>
              <div className="text-sm text-white/95">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div
        className="px-4 py-2.5 flex items-center justify-between text-[10px] text-white/40 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <span className="flex items-center gap-1">
          <CalendarClock size={10} /> 事件时间 {formatFull(marker.updatedAt)}
        </span>
        <span className="font-mono">{marker.id}</span>
      </div>
    </div>
  );
}

export function MarkerPopup({ marker, onClose, sceneConfig }: MarkerPopupProps) {
  return (
    <AnimatePresence>
      {marker && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${marker.coordinate.x}%`,
            top: `${marker.coordinate.y}%`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="pointer-events-auto absolute top-full mt-4"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div
              className="absolute left-1/2 -top-2 w-3 h-3 rotate-45 -translate-x-1/2"
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <PopupCard marker={marker} onClose={onClose} sceneConfig={sceneConfig} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
