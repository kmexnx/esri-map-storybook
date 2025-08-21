import React from 'react';
import { EsriMapView } from './components/EsriMapView';
import { MapLayer } from './types/map.types';

function App() {
  // Example configuration based on your documentation
  const defaultCoordinates = {
    latitude: 39.481112520084416,
    longitude: -104.48777395663238
  };

  const sampleLayers: MapLayer[] = [
    {
      id: 'counties',
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer',
      type: 'feature',
      visible: true
    }
  ];

  return (
    <div className="App">
      <h1>ESRI Map Integration Example</h1>
      <EsriMapView
        coordinates={defaultCoordinates}
        zoomLevel={9}
        layers={sampleLayers}
        height="500px"
      />
    </div>
  );
}

export default App;
