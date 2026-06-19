import type { SceneConfig } from './types';

export const SCENES: Record<string, SceneConfig> = {
  express: {
    id: 'express',
    name: '全国快递网络',
    subtitle: 'Express Network',
    description: '覆盖全国 32 个分拨中心、128 条干线运输线路，实时监控包裹流转状态与异常预警。',
    accentColor: 'express',
    accentColorHex: '#FF6B35',
    backgroundGradient: 'from-[#0A1628] via-[#0F2A4A] to-[#1E3A5F]',
    mapHasBaseLayer: true,
    icon: 'Truck',
  },
  coldChain: {
    id: 'coldChain',
    name: '冷链物流监控',
    subtitle: 'Cold Chain Logistics',
    description: '全程温控冷链运输，实时监测冷库、冷藏车温度，预警温控异常，确保生鲜药品品质。',
    accentColor: 'cold',
    accentColorHex: '#06B6D4',
    backgroundGradient: 'from-[#041424] via-[#0B2A44] to-[#164E63]',
    mapHasBaseLayer: true,
    icon: 'Snowflake',
  },
  sameCity: {
    id: 'sameCity',
    name: '同城即时配送',
    subtitle: 'Same-City Delivery',
    description: '30 分钟极速达服务，动态调度骑手运力，智能划定配送圈，超时订单实时告警。',
    accentColor: 'city',
    accentColorHex: '#10B981',
    backgroundGradient: 'from-[#0A1F1A] via-[#0F2E26] to-[#14532D]',
    mapHasBaseLayer: false,
    icon: 'Bike',
  },
};

export const SCENE_LIST = Object.values(SCENES);
