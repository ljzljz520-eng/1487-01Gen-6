export type MarkerType = 'warehouse' | 'vehicle' | 'exception' | 'zone';

export type MarkerStatus = 'normal' | 'warning' | 'danger' | 'inactive';

export interface Coordinate {
  x: number;
  y: number;
}

export interface BaseMarker {
  id: string;
  type: MarkerType;
  name: string;
  coordinate: Coordinate;
  status: MarkerStatus;
  updatedAt: string;
  description?: string;
}

export interface WarehouseMarker extends BaseMarker {
  type: 'warehouse';
  capacity: number;
  capacityUsed: number;
  staffCount: number;
  temperature?: number;
}

export interface VehicleMarker extends BaseMarker {
  type: 'vehicle';
  driverName: string;
  vehicleNo: string;
  loadWeight: number;
  maxWeight: number;
  speed?: number;
  eta?: string;
  routeId?: string;
}

export interface ExceptionMarker extends BaseMarker {
  type: 'exception';
  trackingNo: string;
  exceptionType: 'damaged' | 'lost' | 'delayed' | 'temperature' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  handler?: string;
  resolvedAt?: string;
}

export interface ZoneMarker extends BaseMarker {
  type: 'zone';
  radius: number;
  slaMinutes: number;
  coverageCount: number;
}

export type LogisticsMarker =
  | WarehouseMarker
  | VehicleMarker
  | ExceptionMarker
  | ZoneMarker;

export interface SceneConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  accentColorHex: string;
  backgroundGradient: string;
  mapHasBaseLayer: boolean;
  icon: 'Truck' | 'Snowflake' | 'Bike';
}

export interface LogisticsMapProps {
  markers: LogisticsMarker[];
  sceneConfig: SceneConfig;
  mode?: 'map' | 'list';
  defaultMode?: 'map' | 'list';
  showLegend?: boolean;
  showFilter?: boolean;
  showStats?: boolean;
  onMarkerClick?: (marker: LogisticsMarker) => void;
  onModeChange?: (mode: 'map' | 'list') => void;
  filterTypes?: MarkerType[];
  onFilterChange?: (types: MarkerType[]) => void;
}
