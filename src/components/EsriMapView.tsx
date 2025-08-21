import React from 'react';
import { useEsriMap } from '../hooks/useEsriMap';
import { EsriMapViewProps } from '../types/map.types';

export const EsriMapView: React.FC<EsriMapViewProps> = ({
  height = '400px',
  width = '100%',
  className = '',
  ...mapOptions
}) => {
  const { mapRef, isLoading, error } = useEsriMap(mapOptions);

  if (error) {
    return (
      <div 
        className={`map-error ${className}`}
        style={{ height, width, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}
      >
        <p style={{ color: '#d32f2f', margin: 0 }}>Error loading map: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height, width }}>
      <div
        ref={mapRef}
        className={`map-container ${className}`}
        style={{ height: '100%', width: '100%' }}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000
          }}
        >
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
};
