import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: { storySort: { order: ['Overview', 'Components'] } }
  }
};

export default preview;
