import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService, ConfirmRequest } from './confirm-dialog.service';

@Component({
  selector: 'app-iebem-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  open = false;
  req: ConfirmRequest | null = null;

  constructor(private svc: ConfirmDialogService) {
    this.svc.requests$.subscribe(r => { this.req = r; this.open = true; });
  }

  close() { this.open = false; }
  onCancel() { if (this.req) this.req.resolver(false); this.close(); }
  onConfirm() { if (this.req) this.req.resolver(true); this.close(); }
}

