import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { useEsriMap } from './useEsriMap';
import { MapLayer } from '../types/map.types';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

// Wrapper component to demonstrate the hook
const EsriMapHookDemo: React.FC<{
  coordinates: { latitude: number; longitude: number };
  zoomLevel?: number;
  layers?: MapLayer[];
  basemap?: string;
  showMarkers?: boolean;
  markersCount?: number;
}> = ({ coordinates, zoomLevel, layers, basemap, showMarkers, markersCount = 3 }) => {
  const { mapRef, mapView, isLoading, error, addMarker, clearGraphics } = useEsriMap({
    coordinates,
    zoomLevel,
    layers,
    basemap,
    onMapLoad: (view) => {
      console.log('Hook demo: Map loaded', view);
    },
    onMapClick: (event) => {
      console.log('Hook demo: Map clicked', event.mapPoint);
    }
  });

  const [markersAdded, setMarkersAdded] = useState(false);

  useEffect(() => {
    if (mapView && showMarkers && !markersAdded) {
      // Add some sample markers around the center point
      const centerLat = coordinates.latitude;
      const centerLng = coordinates.longitude;
      const radius = 0.05; // degrees

      for (let i = 0; i < markersCount; i++) {
        const angle = (2 * Math.PI * i) / markersCount;
        const lat = centerLat + radius * Math.sin(angle);
        const lng = centerLng + radius * Math.cos(angle);
        
        const symbol = new SimpleMarkerSymbol({
          color: i === 0 ? [255, 0, 0] : i === 1 ? [0, 255, 0] : [0, 0, 255],
          size: 12,
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        });

        addMarker(lng, lat, symbol);
      }
      setMarkersAdded(true);
    }
  }, [mapView, showMarkers, markersAdded, coordinates, markersCount, addMarker]);

  const handleClearMarkers = () => {
    clearGraphics();
    setMarkersAdded(false);
  };

  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid #d32f2f', borderRadius: '4px', color: '#d32f2f' }}>
        <h3>Map Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div>Status: {isLoading ? 'Loading...' : 'Ready'}</div>
        {mapView && (
          <>
            <button onClick={handleClearMarkers} disabled={!markersAdded}>
              Clear Markers
            </button>
            <div>Zoom: {mapView.zoom.toFixed(1)}</div>
          </>
        )}
      </div>
      <div
        ref={mapRef}
        style={{
          height: '400px',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

const meta = {
  title: 'Hooks/useEsriMap',
  component: EsriMapHookDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Demonstration of the useEsriMap custom hook. This hook provides programmatic access to map functionality including adding markers, graphics, and map navigation.'
      }
    }
  },
  argTypes: {
    coordinates: {
      description: 'Map center coordinates',
      control: { type: 'object' }
    },
    zoomLevel: {
      description: 'Map zoom level',
      control: { type: 'range', min: 1, max: 20, step: 1 }
    },
    showMarkers: {
      description: 'Automatically add sample markers',
      control: { type: 'boolean' }
    },
    markersCount: {
      description: 'Number of markers to add',
      control: { type: 'range', min: 1, max: 10, step: 1 }
    },
    basemap: {
      description: 'ESRI basemap style',
      control: {
        type: 'select',
        options: [
          'streets-navigation-vector',
          'streets-vector',
          'topo-vector',
          'satellite',
          'hybrid',
          'dark-gray-vector'
        ]
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof EsriMapHookDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  args: {
    coordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    zoomLevel: 9,
    basemap: 'streets-navigation-vector'
  }
};

export const WithMarkers: Story = {
  args: {
    coordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    zoomLevel: 11,
    showMarkers: true,
    markersCount: 5,
    basemap: 'satellite'
  }
};

export const WithLayers: Story = {
  args: {
    coordinates: {
      latitude: 39.771,
      longitude: -104.981
    },
    zoomLevel: 8,
    layers: [
      {
        id: 'counties',
        url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer',
        type: 'feature',
        visible: true,
        title: 'US Counties'
      },
      {
        id: 'graphics',
        type: 'graphics',
        visible: true,
        title: 'Custom Graphics'
      }
    ],
    showMarkers: true,
    markersCount: 3,
    basemap: 'topo-vector'
  }
};
