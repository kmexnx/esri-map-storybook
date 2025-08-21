import type { Preview } from '@storybook/react';

// Import ESRI CSS - this is critical for proper map rendering
import '@arcgis/core/assets/esri/themes/light/main.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
