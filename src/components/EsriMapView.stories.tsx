import type { Meta, StoryObj } from '@storybook/react';
import { EsriMapView } from './EsriMapView';
import { MapLayer } from '../types/map.types';

const meta: Meta<typeof EsriMapView> = {
  title: 'Components/EsriMapView',
  component: EsriMapView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'ESRI Map component with customizable coordinates, zoom levels, and layers. Based on project tracking system requirements.'
      }
    }
  },
  argTypes: {
    coordinates: {
      description: 'Starting coordinates for the map center',
      control: { type: 'object' }
    },
    zoomLevel: {
      description: 'Initial zoom level (higher = more zoomed in)',
      control: { type: 'range', min: 1, max: 20, step: 1 }
    },
    height: {
      description: 'Map container height',
      control: { type: 'text' }
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
          'dark-gray-vector',
          'gray-vector',
          'oceans'
        ]
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story based on your project documentation
export const Default: Story = {
  args: {
    coordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    zoomLevel: 9,
    height: '500px',
    basemap: 'streets-navigation-vector'
  }
};

// Counties display configuration from your docs
export const CountiesDisplay: Story = {
  args: {
    coordinates: {
      latitude: 39.771,
      longitude: -104.981
    },
    zoomLevel: 9,
    height: '500px',
    basemap: 'streets-navigation-vector',
    layers: [
      {
        id: 'counties',
        url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer',
        type: 'feature',
        visible: true,
        title: 'US Counties'
      }
    ]
  }
};

// Interactive display with multiple layers
export const InteractiveDisplay: Story = {
  args: {
    coordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    zoomLevel: 9,
    height: '600px',
    basemap: 'hybrid',
    layers: [
      {
        id: 'highways',
        url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Freeway_System/FeatureServer',
        type: 'feature',
        visible: true,
        title: 'US Highways'
      },
      {
        id: 'graphics',
        type: 'graphics',
        visible: true,
        title: 'Project Markers'
      }
    ],
    onMapLoad: (view) => {
      console.log('Map loaded successfully:', view);
    },
    onMapClick: (event) => {
      console.log('Map clicked at:', event.mapPoint);
    }
  }
};

// High zoom level for detailed view
export const DetailedView: Story = {
  args: {
    coordinates: {
      latitude: 39.7392,
      longitude: -104.9903
    },
    zoomLevel: 15,
    height: '500px',
    basemap: 'satellite'
  }
};

// Low zoom level for wide area view
export const WideAreaView: Story = {
  args: {
    coordinates: {
      latitude: 39.5,
      longitude: -105.0
    },
    zoomLevel: 6,
    height: '500px',
    basemap: 'topo-vector'
  }
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    coordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    zoomLevel: 9,
    height: '500px',
    basemap: 'dark-gray-vector'
  }
};

// Compact size
export const CompactSize: Story = {
  args: {
    coordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    zoomLevel: 9,
    height: '300px',
    basemap: 'streets-vector'
  }
};
