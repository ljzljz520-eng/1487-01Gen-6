import { useMemo, useState } from 'react';
import type { LogisticsMarker, MarkerType } from '../data/types';

const ALL_TYPES: MarkerType[] = ['warehouse', 'vehicle', 'exception', 'zone'];

export function useLogisticsFilter(
  markers: LogisticsMarker[],
  initialTypes: MarkerType[] = ALL_TYPES,
) {
  const [filterTypes, setFilterTypes] = useState<MarkerType[]>(initialTypes);

  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => filterTypes.includes(m.type));
  }, [markers, filterTypes]);

  const stats = useMemo(() => {
    const count = { warehouse: 0, vehicle: 0, exception: 0, zone: 0 };
    const danger = { warehouse: 0, vehicle: 0, exception: 0, zone: 0 };
    markers.forEach((m) => {
      count[m.type] += 1;
      if (m.status === 'danger') danger[m.type] += 1;
    });
    return {
      total: markers.length,
      byType: count,
      dangerByType: danger,
      totalDanger: danger.warehouse + danger.vehicle + danger.exception + danger.zone,
    };
  }, [markers]);

  const toggleType = (type: MarkerType) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  const resetFilter = () => setFilterTypes(ALL_TYPES);

  return {
    filterTypes,
    allTypes: ALL_TYPES,
    filteredMarkers,
    stats,
    toggleType,
    resetFilter,
    setFilterTypes,
  };
}
