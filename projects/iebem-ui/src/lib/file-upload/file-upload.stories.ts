import type { Meta, StoryObj } from '@storybook/angular';
import { FileUploadComponent } from './file-upload.component';

const meta: Meta<FileUploadComponent> = {
  title: 'Components/FileUpload',
  component: FileUploadComponent,
  tags: ['autodocs'],
  args: {
    label: 'Subir archivos',
    accept: '*',
    multiple: true,
    required: false,
    hint: 'PDF, DOC, JPG, PNG hasta 10MB'
  }
};

export default meta;
type Story = StoryObj<FileUploadComponent>;

export const Basic: Story = {};

export const Advanced: Story = {
  render: (args) => ({
    props: { ...args, files: [] as File[] },
    template: `
      <div class="space-y-3">
        <app-iebem-file-upload [label]="label" [accept]="accept" [multiple]="multiple" [required]="required" [hint]="hint"
          (filesSelected)="files = $event"></app-iebem-file-upload>
        <div class="text-sm text-gray-700" *ngIf="files?.length">Archivos seleccionados ({{ files.length }}):</div>
        <ul class="list-disc pl-5 text-sm text-gray-600" *ngIf="files?.length">
          <li *ngFor="let f of files">{{ f.name }} — {{ f.type }} — {{ f.size }} bytes</li>
        </ul>
      </div>
    `
  })
};
