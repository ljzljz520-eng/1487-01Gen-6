import { SceneHeader } from '../components/SceneHeader';
import { LogisticsMap } from '../components/LogisticsMap';
import { SCENES } from '../data/scenes';
import { sameCityMarkers } from '../data/mock/sameCity';

export default function SameCityPage() {
  const scene = SCENES.sameCity;
  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${scene.backgroundGradient} text-white overflow-hidden`}>
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SceneHeader sceneConfig={scene} />
        <div className="h-[calc(100vh-160px)] min-h-[620px]">
          <LogisticsMap markers={sameCityMarkers} sceneConfig={scene} />
        </div>
      </div>
    </div>
  );
}
