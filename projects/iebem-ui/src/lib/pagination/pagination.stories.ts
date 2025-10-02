import type { Meta, StoryObj } from '@storybook/angular';
import { PaginationComponent } from './pagination.component';

const meta: Meta<PaginationComponent> = {
  title: 'Components/Pagination',
  component: PaginationComponent,
  tags: ['autodocs'],
  args: {
    totalItems: 95,
    pageSize: 10,
    currentPage: 1,
    boundaryCount: 1,
    siblingCount: 1,
    size: 'sm'
  }
};

export default meta;
type Story = StoryObj<PaginationComponent>;

export const Basic: Story = {
  render: (args) => ({
    props: { ...args, currentPage: args.currentPage },
    template: `
      <div class="flex items-center gap-4">
        <app-iebem-pagination [totalItems]="totalItems" [pageSize]="pageSize" [currentPage]="currentPage"
          [boundaryCount]="boundaryCount" [siblingCount]="siblingCount" [size]="size"
          (pageChange)="currentPage = $event"></app-iebem-pagination>
        <span class="text-sm text-gray-600">Página: {{ currentPage }}</span>
      </div>
    `
  })
};
