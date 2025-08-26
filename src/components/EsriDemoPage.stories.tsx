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

### 4. Markers Management Section
- **Exact Structure**: \`[{latitude: 40.12, longitude: -104.111}]\`
- **Add/Delete/Navigate**: Full CRUD operations on markers
- **JSON Export**: Download markers in specified format
- **Interactive Map**: Click to add markers, visual representation

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
      control: { 
        type: 'object'
      },
      table: {
        type: { 
          summary: 'MapCoordinates',
          detail: '{ latitude: number; longitude: number }' 
        },
        defaultValue: { 
          summary: '{ latitude: 39.4811, longitude: -104.4877 }' 
        }
      }
    },
    height: {
      description: 'Map container height',
      control: { 
        type: 'select',
        options: ['400px', '500px', '600px', '700px', '800px', '100vh']
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '600px' }
      }
    }
  },
  args: {
    initialCoordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    height: '600px'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Main demo story - Default Denver location with full controls
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
        story: `
Complete ProjectTracker ESRI integration demo with all acceptance criteria implemented.

**Features included:**
- ✅ Satellite basemaps and zoom controls
- ✅ Hosted feature layer management panel (upper right)
- ✅ Markers management with exact structure: \`[{latitude: 40.12, longitude: -104.111}]\`
- ✅ JSON export functionality
- ✅ Interactive map with click-to-add markers

**Demo Controls:**
- Adjust map center coordinates and container height
- All other features are interactive within the component
        `
      }
    },
    controls: {
      include: ['initialCoordinates', 'height']
    }
  }
};

// Preset locations for different demo scenarios
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
        story: `
Demo centered on **New York City** - excellent for testing:
- Urban feature layers and high-density data visualization
- Different coordinate ranges
- Multiple markers in metropolitan area

Perfect for showing how the system handles different geographic regions.
        `
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
        story: `
Demo centered on **Los Angeles** - ideal for demonstrating:
- Satellite imagery and hybrid basemap features
- West coast coordinate examples
- Large metropolitan area coverage

Great for showing basemap switching capabilities.
        `
      }
    }
  }
};

export const ChicagoDemo: Story = {
  args: {
    initialCoordinates: {
      latitude: 41.8781,
      longitude: -87.6298
    },
    height: '600px'
  },
  parameters: {
    docs: {
      description: {
        story: `
Demo centered on **Chicago** - showcases:
- Great Lakes region geography
- Midwest coordinate examples
- Urban planning visualization

Excellent for demonstrating the full range of map capabilities.
        `
      }
    }
  }
};

// Compact version for smaller screens or embedded contexts
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
        story: `
**Compact version** of the demo suitable for:
- Smaller screens or mobile devices
- Embedded contexts within other applications
- Quick demonstrations with limited screen space

All functionality remains fully available in the compact layout.
        `
      }
    }
  }
};

// Large format for presentations
export const PresentationMode: Story = {
  args: {
    initialCoordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    height: '800px'
  },
  parameters: {
    docs: {
      description: {
        story: `
**Presentation mode** with larger map area ideal for:
- Stakeholder presentations and demos
- Conference room displays
- Detailed map exploration
- Showcasing complex feature layer interactions

Perfect for high-impact demonstrations of ProjectTracker capabilities.
        `
      }
    }
  }
};

// Full screen for maximum impact
export const FullScreenDemo: Story = {
  args: {
    initialCoordinates: {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    },
    height: '100vh'
  },
  parameters: {
    docs: {
      description: {
        story: `
**Full viewport height** demo for maximum visual impact:
- Uses entire browser viewport height
- Immersive map experience
- Best for focused map work and detailed exploration
- Professional presentation format

Ideal for executive demonstrations and detailed technical reviews.
        `
      }
    }
  }
};

// Markers showcase with sample data structure
export const MarkersShowcase: Story = {
  args: {
    initialCoordinates: {
      latitude: 40.12,  // Using your exact example coordinates
      longitude: -104.111
    },
    height: '600px'
  },
  parameters: {
    docs: {
      description: {
        story: `
**Markers Management Showcase** centered on the exact coordinates from your example:
\`{ latitude: 40.12, longitude: -104.111 }\`

**Demonstrates:**
- ✅ Exact coordinate structure requested
- ✅ Interactive markers panel (click "📍 Markers" button)
- ✅ JSON export in specified format
- ✅ Add/delete/navigate functionality
- ✅ Sample data loading with your example coordinates

**Demo Instructions:**
1. Click the "📍 Markers" button to open markers panel
2. Use "📝 Load Sample Data" to see example markers including your coordinates
3. Click "📤 Export JSON" to download markers in exact format: \`[{latitude: 40.12, longitude: -104.111}]\`
4. Click anywhere on map to add new markers
5. Use "Go" buttons to navigate to specific markers

Perfect for showcasing the markers management system!
        `
      }
    }
  }
};
