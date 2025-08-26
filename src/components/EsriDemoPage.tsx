import React, { useState, useEffect } from 'react';
import { useEsriMap } from '../hooks/useEsriMap';
import { MapLayer, MapCoordinates, MarkerData } from '../types/map.types';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

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

// Sample marker data with the exact structure requested
const SAMPLE_MARKERS: MarkerData[] = [
  { latitude: 40.12, longitude: -104.111, title: 'Denver North', description: 'Sample location north of Denver' },
  { latitude: 39.7392, longitude: -104.9903, title: 'Downtown Denver', description: 'Denver city center' },
  { latitude: 39.481112520084416, longitude: -104.48777395663238, title: 'Denver Tech', description: 'Tech center area' },
  { latitude: 40.7128, longitude: -74.0060, title: 'New York', description: 'NYC location' },
  { latitude: 34.0522, longitude: -118.2437, title: 'Los Angeles', description: 'LA location' }
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
  const [markers, setMarkers] = useState<MarkerData[]>(SAMPLE_MARKERS);
  const [newMarker, setNewMarker] = useState<{ latitude: string; longitude: string; title: string }>({
    latitude: '',
    longitude: '',
    title: ''
  });
  const [showMarkersPanel, setShowMarkersPanel] = useState(false);

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
      // Add all markers to the map when it loads
      displayAllMarkers();
    },
    onMapClick: (event) => {
      console.log('Map clicked at:', event.mapPoint);
      if (event.mapPoint) {
        const newMarkerData: MarkerData = {
          latitude: event.mapPoint.latitude,
          longitude: event.mapPoint.longitude,
          title: `Clicked Point ${markers.length + 1}`,
          description: `Added by clicking at ${event.mapPoint.latitude.toFixed(4)}, ${event.mapPoint.longitude.toFixed(4)}`
        };
        setMarkers(prev => [...prev, newMarkerData]);
      }
    }
  });

  // Display all markers on the map
  const displayAllMarkers = () => {
    if (!mapView) return;
    
    clearGraphics();
    markers.forEach((marker, index) => {
      const symbol = new SimpleMarkerSymbol({
        color: index < 3 ? [255, 0, 0] : index < 6 ? [0, 255, 0] : [0, 0, 255],
        size: 10,
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      });
      addMarker(marker.longitude, marker.latitude, symbol);
    });
  };

  // Update markers on map when markers array changes
  useEffect(() => {
    if (mapView && markers.length > 0) {
      displayAllMarkers();
    }
  }, [markers, mapView]);

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

  const handleAddMarker = () => {
    const lat = parseFloat(newMarker.latitude);
    const lng = parseFloat(newMarker.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude values');
      return;
    }

    const markerData: MarkerData = {
      latitude: lat,
      longitude: lng,
      title: newMarker.title || `Custom Marker ${markers.length + 1}`,
      description: `Added manually at ${lat}, ${lng}`
    };

    setMarkers(prev => [...prev, markerData]);
    setNewMarker({ latitude: '', longitude: '', title: '' });
  };

  const handleDeleteMarker = (index: number) => {
    setMarkers(prev => prev.filter((_, i) => i !== index));
  };

  const handleLoadSampleData = () => {
    setMarkers(SAMPLE_MARKERS);
  };

  const handleClearAllMarkers = () => {
    setMarkers([]);
    clearGraphics();
  };

  const exportMarkersJson = () => {
    const markersJson = markers.map(({ latitude, longitude }) => ({ latitude, longitude }));
    const dataStr = JSON.stringify(markersJson, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'markers.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
        <button
          onClick={() => setShowMarkersPanel(!showMarkersPanel)}
          style={{
            padding: '8px 16px',
            backgroundColor: showMarkersPanel ? '#1976d2' : '#e3f2fd',
            color: showMarkersPanel ? 'white' : '#1976d2',
            border: `1px solid ${showMarkersPanel ? '#1976d2' : '#1976d2'}`,
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          📍 Markers ({markers.length})
        </button>
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
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
          </div>
        </div>

        {/* Feature Layers Panel */}
        <div style={{
          width: showMarkersPanel ? '280px' : '300px',
          backgroundColor: 'white',
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
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
              <li>✅ Markers management panel</li>
              <li>✅ JSON export functionality</li>
            </ul>
          </div>
        </div>

        {/* Markers Management Panel */}
        {showMarkersPanel && (
          <div style={{
            width: '350px',
            backgroundColor: 'white',
            border: '2px solid #1976d2',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#1976d2' }}>📍 Markers Management</h3>
              <span style={{ fontSize: '12px', color: '#666', backgroundColor: '#e3f2fd', padding: '4px 8px', borderRadius: '12px' }}>
                {markers.length} markers
              </span>
            </div>

            {/* Add New Marker Form */}
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#495057' }}>➕ Add New Marker</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g., 40.12)"
                  value={newMarker.latitude}
                  onChange={(e) => setNewMarker(prev => ({ ...prev, latitude: e.target.value }))}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g., -104.111)"
                  value={newMarker.longitude}
                  onChange={(e) => setNewMarker(prev => ({ ...prev, longitude: e.target.value }))}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                />
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={newMarker.title}
                  onChange={(e) => setNewMarker(prev => ({ ...prev, title: e.target.value }))}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                />
                <button
                  onClick={handleAddMarker}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Add Marker
                </button>
              </div>
            </div>

            {/* Markers List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#495057' }}>📋 Current Markers</h4>
              {markers.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                  No markers yet. Click on the map or add manually above.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {markers.map((marker, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#495057' }}>
                          {marker.title || `Marker ${index + 1}`}
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '11px' }}>
                          {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleGoToLocation(marker.latitude, marker.longitude, 14)}
                        style={{
                          padding: '4px 6px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '10px',
                          marginRight: '6px'
                        }}
                      >
                        Go
                      </button>
                      <button
                        onClick={() => handleDeleteMarker(index)}
                        style={{
                          padding: '4px 6px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleLoadSampleData}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📝 Load Sample Data
              </button>
              <button
                onClick={exportMarkersJson}
                disabled={markers.length === 0}
                style={{
                  padding: '8px 12px',
                  backgroundColor: markers.length === 0 ? '#6c757d' : '#ffc107',
                  color: markers.length === 0 ? '#fff' : '#212529',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: markers.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '12px'
                }}
              >
                📤 Export JSON
              </button>
              <button
                onClick={handleClearAllMarkers}
                disabled={markers.length === 0}
                style={{
                  padding: '8px 12px',
                  backgroundColor: markers.length === 0 ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: markers.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '12px'
                }}
              >
                🗑️ Clear All
              </button>
            </div>

            {/* JSON Preview */}
            <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#495057' }}>📄 JSON Structure Preview:</h4>
              <pre style={{ 
                margin: 0, 
                fontSize: '10px', 
                color: '#495057', 
                backgroundColor: '#ffffff', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                maxHeight: '100px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(
                  markers.slice(0, 2).map(({ latitude, longitude }) => ({ latitude, longitude })), 
                  null, 
                  2
                )}
                {markers.length > 2 && '\n// ... more markers'}
              </pre>
            </div>
          </div>
        )}
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
          📍 Markers: {markers.length}
        </div>
        <div>
          🎨 Basemap: {BASEMAP_OPTIONS.find(b => b.value === selectedBasemap)?.label}
        </div>
      </div>
    </div>
  );
};
