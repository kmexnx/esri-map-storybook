import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    // ESRI ArcGIS specific configuration
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        '@arcgis/core/geometry',
        '@arcgis/core/layers/FeatureLayer',
        '@arcgis/core/layers/GraphicsLayer',
        '@arcgis/core/Map',
        '@arcgis/core/views/MapView',
        '@arcgis/core/Graphic',
        '@arcgis/core/geometry/Point',
        '@arcgis/core/geometry/Polyline',
        '@arcgis/core/geometry/Polygon',
        '@arcgis/core/symbols/SimpleMarkerSymbol',
        '@arcgis/core/symbols/SimpleLineSymbol',
        '@arcgis/core/symbols/SimpleFillSymbol',
        ...(config.optimizeDeps?.include ?? [])
      ],
      exclude: ['@arcgis/core', ...(config.optimizeDeps?.exclude ?? [])]
    };
    
    config.define = {
      ...config.define,
      global: 'globalThis',
    };
    
    // Allow filesystem access for ESRI assets
    config.server = {
      ...config.server,
      fs: {
        allow: ['..', ...((config.server?.fs as any)?.allow ?? [])]
      }
    };
    
    return config;
  },
};

export default config;
