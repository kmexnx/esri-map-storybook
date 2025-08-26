import React, { useState, useEffect } from 'react';
import { useEsriMap } from '../hooks/useEsriMap';
import { MapLayer, MapCoordinates, MarkerData } from '../types/map.types';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

interface DemoPageProps {
  initialCoordinates?: MapCoordinates;
  height?: string;
}

// Updated feature layers to match the reference design
const DEFAULT_FEATURE_LAYERS: MapLayer[] = [
  {
    id: 'cdot-arcgis-points',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer',
    type: 'feature',
    visible: true,
    title: 'CDOT ArcGIS Points',
    opacity: 1.0
  },
  {
    id: 'community-network-boundaries',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer',
    type: 'feature',
    visible: true,
    title: 'Community Network Boundaries',
    opacity: 0.7
  },
  {
    id: 'election-precincts',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer',
    type: 'feature',
    visible: true,
    title: 'Election Precincts',
    opacity: 0.8
  },
  {
    id: 'denver-snow-routes',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Freeway_System/FeatureServer',
    type: 'feature',
    visible: false,
    title: 'Denver Snow Routes',
    opacity: 0.9,
    hasError: true // Simulate the error shown in the reference
  }
];

// Sample marker data
const SAMPLE_MARKERS: MarkerData[] = [
  { latitude: 40.12, longitude: -104.111, title: 'Denver North', description: 'Sample location north of Denver' },
  { latitude: 39.7392, longitude: -104.9903, title: 'Downtown Denver', description: 'Denver city center' },
  { latitude: 39.481112520084416, longitude: -104.48777395663238, title: 'Denver Tech', description: 'Tech center area' }
];

const BASEMAP_OPTIONS = [
  { value: 'topo-vector', label: 'Topographic' },
  { value: 'streets-navigation-vector', label: 'Streets' },
  { value: 'satellite', label: 'Satellite' },
  { value: 'hybrid', label: 'Satellite with Labels' },
  { value: 'dark-gray-vector', label: 'Dark Gray' },
  { value: 'oceans', label: 'Oceans' }
];

export const EsriDemoPage: React.FC<DemoPageProps> = ({
  initialCoordinates = { latitude: 39.7392, longitude: -104.9903 }, // Denver coordinates
  height = '100vh'
}) => {
  const [selectedBasemap, setSelectedBasemap] = useState('topo-vector');
  const [zoomLevel, setZoomLevel] = useState(10);
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_FEATURE_LAYERS);
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [markers, setMarkers] = useState<MarkerData[]>(SAMPLE_MARKERS);
  const [searchQuery, setSearchQuery] = useState('');
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
    layers: layers.filter(layer => layer.visible && !layer.hasError),
    basemap: selectedBasemap,
    onMapLoad: (view) => {
      console.log('Map loaded:', view);
      displayAllMarkers();
    },
    onMapClick: (event) => {
      if (event.mapPoint) {
        const newMarkerData: MarkerData = {
          latitude: event.mapPoint.latitude,
          longitude: event.mapPoint.longitude,
          title: `Point ${markers.length + 1}`,
          description: `Added at ${event.mapPoint.latitude.toFixed(4)}, ${event.mapPoint.longitude.toFixed(4)}`
        };
        setMarkers(prev => [...prev, newMarkerData]);
      }
    }
  });

  const displayAllMarkers = () => {
    if (!mapView) return;
    clearGraphics();
    markers.forEach((marker, index) => {
      const symbol = new SimpleMarkerSymbol({
        color: [0, 122, 255], // Blue color matching modern design
        size: 8,
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      });
      addMarker(marker.longitude, marker.latitude, symbol);
    });
  };

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would geocode the search query
    console.log('Searching for:', searchQuery);
  };

  const exportMarkersJson = () => {
    const markersJson = markers.map(({ latitude, longitude }) => ({ latitude, longitude }));
    const dataStr = JSON.stringify(markersJson, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'markers.json');
    linkElement.click();
  };

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #e74c3c', 
        borderRadius: '4px', 
        color: '#e74c3c', 
        backgroundColor: '#fdf2f2',
        margin: '20px'
      }}>
        <h3>Map Error</h3>
        <p>{error}</p>
        <p>Please ensure ESRI assets are properly configured.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: height === '100vh' ? '100vh' : height,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Top Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e1e5e9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
            <input
              type="text"
              placeholder="Find address or place"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f9fafb'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#6b7280'
              }}
            >
              🔍
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '20px' }}>
          <select
            value={selectedBasemap}
            onChange={(e) => setSelectedBasemap(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '13px',
              backgroundColor: 'white'
            }}
          >
            {BASEMAP_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowMarkersPanel(!showMarkersPanel)}
            style={{
              padding: '6px 12px',
              backgroundColor: showMarkersPanel ? '#007aff' : '#f1f3f4',
              color: showMarkersPanel ? 'white' : '#5f6368',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            📍 Markers ({markers.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Map Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            ref={mapRef}
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#f5f5f5'
            }}
          />

          {/* Map Zoom Controls */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => mapView?.goTo({ zoom: (mapView.zoom || zoomLevel) + 1 })}
              style={{
                padding: '12px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                borderBottom: '1px solid #e1e5e9'
              }}
            >
              +
            </button>
            <button
              onClick={() => mapView?.goTo({ zoom: (mapView.zoom || zoomLevel) - 1 })}
              style={{
                padding: '12px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              −
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '16px 24px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid #e1e5e9',
                  borderTop: '2px solid #007aff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Loading map...</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Layers */}
        <div style={{
          width: showMarkersPanel ? '300px' : '320px',
          backgroundColor: 'white',
          borderLeft: '1px solid #e1e5e9',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {!showMarkersPanel ? (
            // Layers Panel
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '16px', 
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Layers
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
                      {layer.hasError ? (
                        <span style={{ 
                          fontSize: '16px', 
                          color: '#dc3545',
                          marginTop: '2px'
                        }}>
                          ⚠️
                        </span>
                      ) : (
                        <div style={{
                          width: '16px',
                          height: '16px',
                          marginTop: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: layer.visible ? '#28a745' : '#6c757d'
                            }}
                          />
                        </div>
                      )}
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '16px',
                            color: '#6c757d'
                          }}>
                            👁
                          </span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151'
                          }}>
                            {layer.title}
                          </span>
                        </div>
                        
                        {layer.hasError && (
                          <div style={{ 
                            marginTop: '4px',
                            fontSize: '12px',
                            color: '#dc3545'
                          }}>
                            An error occurred loading this layer
                          </div>
                        )}
                      </div>

                      {!layer.hasError && (
                        <label style={{ 
                          position: 'relative',
                          display: 'inline-block',
                          width: '32px',
                          height: '18px'
                        }}>
                          <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={() => handleLayerToggle(layer.id)}
                            style={{ 
                              opacity: 0,
                              width: 0,
                              height: 0
                            }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: layer.visible ? '#007aff' : '#ccc',
                            borderRadius: '18px',
                            transition: '0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px'
                          }}>
                            <div style={{
                              height: '14px',
                              width: '14px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              transform: layer.visible ? 'translateX(14px)' : 'translateX(0)',
                              transition: '0.2s'
                            }} />
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Tools */}
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>+</button>
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>↖️</button>
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>📐</button>
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>📏</button>
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>🗃️</button>
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>📄</button>
                </div>
              </div>
            </div>
          ) : (
            // Markers Panel
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  Markers Management
                </h3>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}>
                  {markers.length} markers
                </span>
              </div>

              {/* Markers List */}
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
                {markers.map((marker, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      marginBottom: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', fontSize: '14px', color: '#374151' }}>
                        {marker.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                      </div>
                    </div>
                    <button
                      onClick={() => goToLocation(marker.longitude, marker.latitude, 14)}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: '#007aff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginLeft: '8px'
                      }}
                    >
                      Go
                    </button>
                  </div>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={exportMarkersJson}
                disabled={markers.length === 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: markers.length === 0 ? '#f3f4f6' : '#007aff',
                  color: markers.length === 0 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: markers.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📤 Export JSON ({markers.length})
              </button>

              {/* JSON Preview */}
              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  JSON Structure:
                </div>
                <pre style={{ 
                  margin: 0,
                  fontSize: '10px',
                  color: '#6b7280',
                  backgroundColor: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb',
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
      </div>

      {/* Bottom Attribution */}
      <div style={{
        padding: '8px 20px',
        backgroundColor: 'white',
        borderTop: '1px solid #e1e5e9',
        fontSize: '12px',
        color: '#6b7280',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Esri, TomTom, Garmin, FAO, METI/NASA, USGS</span>
        <span>Powered by Esri</span>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
