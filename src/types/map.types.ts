export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapLayer {
  id: string;
  url?: string;
  type: 'feature' | 'graphics' | 'tile' | 'basemap';
  visible: boolean;
  opacity?: number;
  title?: string;
}

export interface MapConfiguration {
  zoomLevel: number;
  startLocation: MapCoordinates;
}

export interface ProjectGeography {
  type: 'Point' | 'LineString' | 'Polygon';
  coordinates: number[] | number[][] | number[][][];
}

export interface UseEsriMapOptions {
  coordinates: MapCoordinates;
  zoomLevel?: number;
  layers?: MapLayer[];
  basemap?: string;
  onMapLoad?: (view: __esri.MapView) => void;
  onMapClick?: (event: __esri.ViewClickEvent) => void;
}

export interface EsriMapViewProps extends UseEsriMapOptions {
  height?: string;
  width?: string;
  className?: string;
}
