import { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { UseEsriMapOptions, MapLayer } from '../types/map.types';

export const useEsriMap = (options: UseEsriMapOptions) => {
  const {
    coordinates,
    zoomLevel = 9,
    layers = [],
    basemap = 'streets-navigation-vector',
    onMapLoad,
    onMapClick
  } = options;

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState<MapView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create the map
        const map = new Map({
          basemap: basemap
        });

        // Create the map view
        const view = new MapView({
          container: mapRef.current!,
          map: map,
          center: [coordinates.longitude, coordinates.latitude],
          zoom: zoomLevel
        });

        // Add layers to the map
        layers.forEach((layer) => {
          const esriLayer = createEsriLayer(layer);
          if (esriLayer) {
            map.add(esriLayer);
          }
        });

        // Wait for the view to load
        await view.when();

        // Set up click event handler
        if (onMapClick) {
          view.on('click', onMapClick);
        }

        setMapView(view);
        setIsLoading(false);

        // Call the onMapLoad callback
        if (onMapLoad) {
          onMapLoad(view);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, [coordinates, zoomLevel, basemap]); // Re-run when these change

  // Update layers when they change
  useEffect(() => {
    if (mapView && mapView.map) {
      // Remove existing layers (except basemap)
      mapView.map.layers.removeAll();
      
      // Add new layers
      layers.forEach((layer) => {
        const esriLayer = createEsriLayer(layer);
        if (esriLayer) {
          mapView.map.add(esriLayer);
        }
      });
    }
  }, [layers, mapView]);

  const createEsriLayer = (layer: MapLayer) => {
    switch (layer.type) {
      case 'feature':
        return new FeatureLayer({
          id: layer.id,
          url: layer.url,
          visible: layer.visible,
          opacity: layer.opacity ?? 1,
          title: layer.title
        });
      case 'graphics':
        return new GraphicsLayer({
          id: layer.id,
          visible: layer.visible,
          opacity: layer.opacity ?? 1,
          title: layer.title
        });
      default:
        console.warn(`Layer type '${layer.type}' not implemented`);
        return null;
    }
  };

  const addGraphic = (graphic: Graphic) => {
    if (mapView) {
      const graphicsLayer = mapView.map.layers.find(
        layer => layer.type === 'graphics'
      ) as GraphicsLayer;
      
      if (graphicsLayer) {
        graphicsLayer.add(graphic);
      } else {
        // Create a new graphics layer if none exists
        const newGraphicsLayer = new GraphicsLayer({
          id: 'default-graphics',
          title: 'Graphics'
        });
        newGraphicsLayer.add(graphic);
        mapView.map.add(newGraphicsLayer);
      }
    }
  };

  const addMarker = (longitude: number, latitude: number, symbol?: SimpleMarkerSymbol) => {
    const point = new Point({
      longitude,
      latitude
    });

    const defaultSymbol = new SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: {
        color: [255, 255, 255],
        width: 2
      }
    });

    const graphic = new Graphic({
      geometry: point,
      symbol: symbol || defaultSymbol
    });

    addGraphic(graphic);
    return graphic;
  };

  const goToLocation = (longitude: number, latitude: number, zoomLevel?: number) => {
    if (mapView) {
      mapView.goTo({
        center: [longitude, latitude],
        zoom: zoomLevel ?? mapView.zoom
      });
    }
  };

  const clearGraphics = () => {
    if (mapView) {
      const graphicsLayers = mapView.map.layers.filter(
        layer => layer.type === 'graphics'
      ) as GraphicsLayer[];
      
      graphicsLayers.forEach(layer => {
        layer.removeAll();
      });
    }
  };

  return {
    mapRef,
    mapView,
    isLoading,
    error,
    addMarker,
    addGraphic,
    goToLocation,
    clearGraphics
  };
};
