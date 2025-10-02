import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../projects/iebem-ui/src/lib/**/*.stories.@(ts|mdx)'
  ],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { docs: false }
    },
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  docs: {
    autodocs: false
  }
};

export default config;
