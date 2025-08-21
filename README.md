# ESRI Map Storybook

A React + TypeScript + Vite + Storybook integration with ESRI ArcGIS Maps SDK for custom map visualization with hooks.

## Features

- 🗺️ **ESRI ArcGIS Integration**: Full integration with ESRI ArcGIS Maps SDK for JavaScript
- ⚛️ **React Hooks**: Custom `useEsriMap` hook for programmatic map control
- 📚 **Storybook**: Interactive documentation and component showcase
- 🔧 **TypeScript**: Full type safety for map configurations and coordinates
- ⚡ **Vite**: Fast development and build tooling
- 🎨 **Multiple Basemaps**: Support for various ESRI basemap styles
- 📍 **Layer Management**: Support for feature layers, graphics layers, and custom overlays

## Based on Project Requirements

This implementation is based on the provided project tracking system documentation:

- **Zoom Level Configuration**: Configurable zoom levels (default: 9)
- **Starting Location**: Customizable center coordinates
- **Display Types**: Support for interactive and counties display modes
- **Coordinate Storage**: Compatible with geographic coordinate formats
- **Project Geometry**: Support for Points, LineStrings, and Polygons

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kmexnx/esri-map-storybook.git
cd esri-map-storybook

# Install dependencies
npm install

# 🚨 IMPORTANT: Copy ESRI assets for proper functionality
cp -r node_modules/@arcgis/core/assets public/
```

### Development

```bash
# Start the development server
npm run dev

# Start Storybook
npm run storybook
```

### Building

```bash
# Build the project
npm run build

# Build Storybook
npm run build-storybook
```

## 🚨 Troubleshooting ESRI Issues

If you encounter the error:
```
Error: Failed to resolve entry for package "@arcgis/core"
```

**Quick Fix:**
```bash
# 1. Copy ESRI assets to public directory
cp -r node_modules/@arcgis/core/assets public/

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Restart dev server
npm run dev
```

**Alternative Solutions:**

1. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   cp -r node_modules/@arcgis/core/assets public/
   ```

2. **Use CDN instead (add to index.html):**
   ```html
   <link rel="stylesheet" href="https://js.arcgis.com/4.30/esri/themes/light/main.css">
   <script src="https://js.arcgis.com/4.30/"></script>
   ```

3. **Check if assets exist:**
   ```bash
   ls public/assets/esri
   # Should show folders like: css, fonts, images, themes, etc.
   ```

## Usage

### Basic Map Component

```tsx
import { EsriMapView } from './components/EsriMapView';

function App() {
  const coordinates = {
    latitude: 39.481112520084416,
    longitude: -104.48777395663238
  };

  return (
    <EsriMapView
      coordinates={coordinates}
      zoomLevel={9}
      height="500px"
      basemap="streets-navigation-vector"
    />
  );
}
```

### Using the Custom Hook

```tsx
import { useEsriMap } from './hooks/useEsriMap';

function CustomMapComponent() {
  const { mapRef, mapView, addMarker, clearGraphics } = useEsriMap({
    coordinates: { latitude: 39.4811, longitude: -104.4877 },
    zoomLevel: 9,
    onMapLoad: (view) => console.log('Map loaded!', view),
    onMapClick: (event) => console.log('Clicked at:', event.mapPoint)
  });

  const handleAddMarker = () => {
    addMarker(-104.4877, 39.4811);
  };

  return (
    <div>
      <button onClick={handleAddMarker}>Add Marker</button>
      <button onClick={clearGraphics}>Clear Graphics</button>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}
```

### With Layers

```tsx
const layers = [
  {
    id: 'counties',
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer',
    type: 'feature' as const,
    visible: true,
    title: 'US Counties'
  }
];

<EsriMapView
  coordinates={coordinates}
  layers={layers}
  zoomLevel={9}
/>
```

## Configuration Types

Based on the project documentation, the following configurations are supported:

### Interactive Display
```json
{
  "zoomLevel": 9,
  "startLocation": {
    "latitude": 39.481112520084416,
    "longitude": -104.48777395663238
  }
}
```

### Counties Display
```json
{
  "zoomLevel": 9,
  "startLocation": {
    "latitude": 39.771,
    "longitude": -104.981
  }
}
```

## API Reference

### `useEsriMap` Hook

```typescript
const {
  mapRef,      // Ref for the map container
  mapView,     // ESRI MapView instance
  isLoading,   // Loading state
  error,       // Error state
  addMarker,   // Function to add markers
  addGraphic,  // Function to add graphics
  goToLocation,// Function to navigate
  clearGraphics// Function to clear graphics
} = useEsriMap(options);
```

### `EsriMapView` Component Props

```typescript
interface EsriMapViewProps {
  coordinates: { latitude: number; longitude: number };
  zoomLevel?: number;
  layers?: MapLayer[];
  basemap?: string;
  height?: string;
  width?: string;
  className?: string;
  onMapLoad?: (view: MapView) => void;
  onMapClick?: (event: ViewClickEvent) => void;
}
```

## Supported Basemaps

- `streets-navigation-vector`
- `streets-vector`
- `topo-vector`
- `satellite`
- `hybrid`
- `dark-gray-vector`
- `gray-vector`
- `oceans`

## Storybook Stories

The project includes comprehensive Storybook stories:

- **Default**: Basic map with default configuration
- **Counties Display**: Map with county boundaries layer
- **Interactive Display**: Map with multiple layers and interactions
- **Detailed View**: High zoom level for detailed viewing
- **Wide Area View**: Low zoom level for regional overview
- **Dark Theme**: Dark basemap styling
- **Hook Demos**: Examples using the custom hook

## Project Structure

```
src/
├── components/
│   ├── EsriMapView.tsx         # Main map component
│   └── EsriMapView.stories.tsx # Storybook stories
├── hooks/
│   ├── useEsriMap.ts           # Custom map hook
│   └── useEsriMap.stories.tsx  # Hook demos
├── types/
│   └── map.types.ts            # TypeScript definitions
├── utils/
│   └── mapUtils.ts             # Map utility functions
└── main.tsx                    # Application entry point
```

## Common Issues & Solutions

### 1. ESRI Module Resolution
**Issue**: `Failed to resolve entry for package "@arcgis/core"`
**Solution**: Copy assets and clear cache as shown above

### 2. Maps Not Rendering
**Issue**: Blank map container or loading indefinitely
**Solution**: Ensure ESRI CSS is imported and assets are available

### 3. TypeScript Errors
**Issue**: Type errors with ESRI modules
**Solution**: The project includes proper TypeScript definitions

### 4. Storybook Issues
**Issue**: Stories not loading or ESRI components failing
**Solution**: Storybook config is pre-configured for ESRI compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests and stories
5. Submit a pull request

## License

MIT License - see LICENSE file for details
