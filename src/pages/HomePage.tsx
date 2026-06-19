import { motion } from 'framer-motion';
import { MapPin, Network, Activity } from 'lucide-react';
import { SceneCard } from '../components/SceneCard';
import { SCENE_LIST } from '../data/scenes';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050B16] via-[#0A1628] to-[#0F1F38] text-white overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14 lg:py-20">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-14 sm:mb-20"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6B35] via-[#FF8A3D] to-[#FFB547] shadow-lg">
              <MapPin size={22} className="text-white drop-shadow" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900/90 animate-pulse" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-lg tracking-tight">LogiMap</div>
              <div className="text-[10px] text-white/40 tracking-widest uppercase">Logistics Marker SDK</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-white/60">
            <span className="flex items-center gap-1.5"><Network size={12} /> 4 标记类型</span>
            <span className="flex items-center gap-1.5"><Activity size={12} /> 3 示例场景</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium">
              v1.0.0
            </span>
          </div>
        </motion.nav>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-white/70 tracking-wide">一款面向物流运营场景的可视化标注组件</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-5">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              物流节点的
            </span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#FF8A3D] to-[#06B6D4] bg-clip-text text-transparent">
              地理空间叙事
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl">
            支持仓库、车辆、异常包裹、配送范围四类标记，点击即弹出状态与时间信息。
            无地图底图时自动退化为站点列表，保证功能始终可用。
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
          {SCENE_LIST.map((scene, i) => (
            <SceneCard key={scene.id} scene={scene} index={i} />
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { label: '标记类型', value: '4 类', sub: '仓库/车辆/异常/范围' },
            { label: '状态系统', value: '4 档', sub: '正常/注意/异常/离线' },
            { label: '底图降级', value: '自适应', sub: '无地图自动列表化' },
            { label: '交互体验', value: '流畅动效', sub: '脉冲/抖动/波纹' },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-light rounded-2xl px-4 py-4 sm:px-5 sm:py-5"
            >
              <div className="font-display font-bold text-xl sm:text-2xl text-white mb-1">
                {item.value}
              </div>
              <div className="text-xs font-medium text-white/80 mb-0.5">{item.label}</div>
              <div className="text-[11px] text-white/45">{item.sub}</div>
            </div>
          ))}
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40"
        >
          <p>LogiMap · Logistics Map Marker Component · Built with React + Vite + TailwindCSS</p>
          <p className="font-mono">© 2026</p>
        </motion.footer>
      </div>
    </div>
  );
}
