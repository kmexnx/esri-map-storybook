import type { Meta, StoryObj } from '@storybook/react';
import { EsriDemoPage } from './EsriDemoPage';

const meta: Meta<typeof EsriDemoPage> = {
  title: 'Demo/ProjectTracker Integration',
  component: EsriDemoPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 🗺️ ESRI Demo Page - ProjectTracker Integration

This comprehensive demo showcases all the requirements for the ProjectTracker ESRI map integration:

## ✅ Acceptance Criteria Met:

### 1. Generic ESRI Map Page
- Full-featured map interface with professional styling
- Responsive layout with map and controls panel
- Error handling and loading states

### 2. Satellite and Zoom Features  
- **Basemap Switching**: Streets, Satellite, Hybrid, Topographic, Dark Gray, Oceans
- **Interactive Zoom**: Range slider + mouse wheel + zoom buttons
- **Real-time Zoom Display**: Shows current zoom level dynamically

### 3. Hosted Feature Layer List (Upper Right Corner)
- **Visual Layer Panel**: Styled panel in upper-right corner
- **Toggle Controls**: Checkbox interface to show/hide layers
- **Layer Status**: Visual indicators for active/inactive layers
- **Opacity Display**: Shows layer transparency levels
- **Hardcoded Layers**: US Counties, Highways, States, Major Cities

## 🎯 Additional Features:
- **Click-to-Add Markers**: Click anywhere on map to add location markers
- **Quick Navigation**: Preset buttons for major cities
- **Status Bar**: Real-time coordinates, zoom, and layer count
- **Professional UI**: Clean, intuitive design matching modern web standards
- **Interactive Demo**: All controls are fully functional

## 🔧 Technical Implementation:
- Built on the custom \`useEsriMap\` hook
- Fully typed TypeScript interfaces
- State management for all map interactions
- ESRI ArcGIS SDK integration
- Responsive design for various screen sizes

Perfect for demonstrating ProjectTracker's map capabilities to stakeholders!
        `
      }
    }
  },
  argTypes: {
    initialCoordinates: {
      description: 'Starting map center coordinates',
      control: { type: 'object' }
    },
    height: {
      description: 'Map container height',
      control: { type: 'text' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Main demo story - Default Denver location
export const ProjectTrackerDemo: Story = {
  args: {
    initialCoordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    height: '600px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete ProjectTracker ESRI integration demo with all acceptance criteria implemented. Features satellite basemaps, zoom controls, and hosted feature layer management panel.'
      }
    }
  }
};

// Alternative locations for testing
export const NewYorkDemo: Story = {
  args: {
    initialCoordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    height: '600px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo centered on New York City - great for testing urban feature layers and high-density data visualization.'
      }
    }
  }
};

export const LosAngelesDemo: Story = {
  args: {
    initialCoordinates: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    height: '600px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo centered on Los Angeles - ideal for demonstrating satellite imagery and hybrid basemap features.'
      }
    }
  }
};

// Compact version for smaller screens
export const CompactDemo: Story = {
  args: {
    initialCoordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    height: '400px'
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version of the demo suitable for smaller screens or embedded contexts.'
      }
    }
  }
};
