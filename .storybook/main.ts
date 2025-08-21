import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    // Ensure ESRI modules are properly handled
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['@arcgis/core', ...(config.optimizeDeps?.include ?? [])],
    };
    
    config.define = {
      ...config.define,
      global: 'globalThis',
    };
    
    return config;
  },
};

export default config;
