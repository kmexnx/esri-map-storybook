import React, { useState } from 'react';
import { useEsriMap } from '../hooks/useEsriMap';
import { MapLayer, MapCoordinates } from '../types/map.types';

interface DemoPageProps {
  initialCoordinates?: MapCoordinates;
  height?: string;
}

// Hardcoded hosted feature layers (Vo will provide real ones)
const DEFAULT_FEATURE_LAYERS: MapLayer[] = [
  {
    id: 'usa-counties',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer',
    type: 'feature',
    visible: true,
    title: 'US Counties',
    opacity: 0.7
  },
  {
    id: 'usa-highways',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Freeway_System/FeatureServer',
    type: 'feature',
    visible: false,
    title: 'US Highways',
    opacity: 0.8
  },
  {
    id: 'usa-states',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer',
    type: 'feature',
    visible: false,
    title: 'US States',
    opacity: 0.6
  },
  {
    id: 'usa-cities',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer',
    type: 'feature',
    visible: false,
    title: 'Major Cities',
    opacity: 1.0
  }
];

const BASEMAP_OPTIONS = [
  { value: 'streets-navigation-vector', label: 'Streets' },
  { value: 'satellite', label: 'Satellite' },
  { value: 'hybrid', label: 'Satellite with Labels' },
  { value: 'topo-vector', label: 'Topographic' },
  { value: 'dark-gray-vector', label: 'Dark Gray' },
  { value: 'oceans', label: 'Oceans' }
];

export const EsriDemoPage: React.FC<DemoPageProps> = ({
  initialCoordinates = { latitude: 39.481112520084416, longitude: -104.48777395663238 },
  height = '600px'
}) => {
  const [selectedBasemap, setSelectedBasemap] = useState('streets-navigation-vector');
  const [zoomLevel, setZoomLevel] = useState(9);
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_FEATURE_LAYERS);
  const [coordinates, setCoordinates] = useState(initialCoordinates);

  const { 
    mapRef, 
    mapView, 
    isLoading, 
    error, 
    addMarker, 
    clearGraphics,
    goToLocation 
  } = useEsriMap({
    coordinates,
    zoomLevel,
    layers: layers.filter(layer => layer.visible),
    basemap: selectedBasemap,
    onMapLoad: (view) => {
      console.log('Demo map loaded:', view);
    },
    onMapClick: (event) => {
      console.log('Map clicked at:', event.mapPoint);
      // Add a marker at clicked location
      if (event.mapPoint) {
        addMarker(event.mapPoint.longitude, event.mapPoint.latitude);
      }
    }
  });

  const handleLayerToggle = (layerId: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  };

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
    if (mapView) {
      mapView.goTo({ zoom: newZoom });
    }
  };

  const handleGoToLocation = (lat: number, lng: number, zoom: number = 12) => {
    const newCoords = { latitude: lat, longitude: lng };
    setCoordinates(newCoords);
    goToLocation(lng, lat, zoom);
  };

  const predefinedLocations = [
    { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
    { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 }
  ];

  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid #d32f2f', borderRadius: '8px', color: '#d32f2f', backgroundColor: '#ffebee' }}>
        <h3>Map Error</h3>
        <p>{error}</p>
        <p>Please ensure ESRI assets are properly configured. See README for setup instructions.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, color: '#2e7d32' }}>🗺️ ESRI Map Demo - ProjectTracker Integration</h1>
        <div style={{ 
          padding: '8px 16px', 
          backgroundColor: isLoading ? '#fff3e0' : '#e8f5e8', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: isLoading ? '#f57c00' : '#2e7d32'
        }}>
          {isLoading ? '⏳ Loading...' : '✅ Ready'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', height }}>
        {/* Main Map Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            ref={mapRef}
            style={{
              height: '100%',
              width: '100%',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5'
            }}
          />
          
          {/* Map Controls Overlay */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: '200px'
          }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Basemap Style:
              </label>
              <select
                value={selectedBasemap}
                onChange={(e) => setSelectedBasemap(e.target.value)}
                style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {BASEMAP_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Zoom Level: {mapView ? mapView.zoom.toFixed(1) : zoomLevel}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={mapView ? mapView.zoom : zoomLevel}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Quick Navigation:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {predefinedLocations.map(location => (
                  <button
                    key={location.name}
                    onClick={() => handleGoToLocation(location.lat, location.lng)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={clearGraphics}
              style={{
                padding: '6px 12px',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear Markers
            </button>
          </div>
        </div>

        {/* Feature Layers Panel - Upper Right Corner */}
        <div style={{
          width: '300px',
          backgroundColor: 'white',
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1976d2', borderBottom: '2px solid #e3f2fd', paddingBottom: '10px' }}>
            📋 Feature Layers
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {layers.map((layer) => (
              <div
                key={layer.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: layer.visible ? '2px solid #4caf50' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: layer.visible ? '#f1f8e9' : '#fafafa',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="checkbox"
                  id={layer.id}
                  checked={layer.visible}
                  onChange={() => handleLayerToggle(layer.id)}
                  style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                />
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor={layer.id}
                    style={{
                      fontWeight: layer.visible ? 'bold' : 'normal',
                      color: layer.visible ? '#2e7d32' : '#666',
                      cursor: 'pointer',
                      display: 'block',
                      fontSize: '14px'
                    }}
                  >
                    {layer.title}
                  </label>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                    Opacity: {((layer.opacity || 1) * 100).toFixed(0)}%
                  </div>
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: layer.visible ? '#4caf50' : '#ccc'
                }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1976d2', fontSize: '14px' }}>
              🎯 Demo Features:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#666' }}>
              <li>✅ Satellite & Basemap switching</li>
              <li>✅ Interactive zoom controls</li>
              <li>✅ Hosted feature layer toggle</li>
              <li>✅ Click to add markers</li>
              <li>✅ Quick navigation</li>
              <li>✅ Layer opacity visualization</li>
            </ul>
          </div>

          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '6px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#f57c00' }}>
              💡 <strong>Tip:</strong> Click anywhere on the map to add markers. Use the layer checkboxes to show/hide different data sets.
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div>
          📍 Center: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
        </div>
        <div>
          🔍 Zoom: {mapView ? mapView.zoom.toFixed(1) : zoomLevel}
        </div>
        <div>
          🗂️ Active Layers: {layers.filter(l => l.visible).length}/{layers.length}
        </div>
        <div>
          🎨 Basemap: {BASEMAP_OPTIONS.find(b => b.value === selectedBasemap)?.label}
        </div>
      </div>
    </div>
  );
};
