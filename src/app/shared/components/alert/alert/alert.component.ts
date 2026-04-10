import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AlertService,
  Alert,
} from '../../../../dashboard/services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="alert-stack">
      @for (alert of alertSvc.alerts$ | async; track alert.id) {
        <div class="al al-{{ alert.type }}" [class.closing]="alert.closing">
          <span class="al-icon" [innerHTML]="icon(alert.type)"></span>
          <div class="al-body">
            <p class="al-title">{{ alert.title }}</p>
            @if (alert.message) {
              <p class="al-msg">{{ alert.message }}</p>
            }
          </div>
          <button
            class="al-close"
            (click)="alertSvc.dismiss(alert.id)"
            aria-label="إغلاق"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          @if (alert.duration > 0) {
            <div
              class="al-bar"
              [style.animation-duration.ms]="alert.duration"
            ></div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes alIn {
        from {
          opacity: 0;
          transform: translateY(-10px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes alOut {
        from {
          opacity: 1;
          transform: translateY(0);
          max-height: 120px;
          margin-bottom: 8px;
        }
        to {
          opacity: 0;
          transform: translateY(-6px);
          max-height: 0;
          margin-bottom: 0;
          padding: 0;
        }
      }
      @keyframes bar {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      .alert-stack {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 360px;
        max-width: calc(100vw - 40px);
      }

      .al {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 11px 13px;
        border-radius: 8px;
        border-width: 0.5px;
        border-style: solid;
        position: relative;
        overflow: hidden;
        animation: alIn 0.22s ease both;
        transition:
          max-height 0.3s,
          opacity 0.3s,
          margin 0.3s,
          padding 0.3s;
      }
      .al.closing {
        animation: alOut 0.35s ease both;
        pointer-events: none;
      }

      .al-icon {
        width: 17px;
        height: 17px;
        flex-shrink: 0;
        margin-top: 1px;
      }
      .al-body {
        flex: 1;
        min-width: 0;
      }
      .al-title {
        font-size: 13px;
        font-weight: 500;
        margin: 0 0 2px;
        line-height: 1.4;
      }
      .al-msg {
        font-size: 12px;
        margin: 0;
        line-height: 1.5;
      }
      .al-close {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        border-radius: 4px;
        opacity: 0.55;
        transition: opacity 0.15s;
        color: inherit;
      }
      .al-close:hover {
        opacity: 1;
      }
      .al-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        animation: bar linear both;
      }

      .al-error {
        background: #fcebeb;
        border-color: #f09595;
      }
      .al-error .al-title {
        color: #a32d2d;
      }
      .al-error .al-msg {
        color: #791f1f;
      }
      .al-error .al-bar {
        background: #e24b4a;
      }
      .al-error .al-close {
        color: #a32d2d;
      }

      .al-success {
        background: #eaf3de;
        border-color: #97c459;
      }
      .al-success .al-title {
        color: #27500a;
      }
      .al-success .al-msg {
        color: #3b6d11;
      }
      .al-success .al-bar {
        background: #3b6d11;
      }
      .al-success .al-close {
        color: #27500a;
      }

      .al-warning {
        background: #faeeda;
        border-color: #ef9f27;
      }
      .al-warning .al-title {
        color: #633806;
      }
      .al-warning .al-msg {
        color: #854f0b;
      }
      .al-warning .al-bar {
        background: #854f0b;
      }
      .al-warning .al-close {
        color: #633806;
      }

      .al-info {
        background: #e6f1fb;
        border-color: #85b7eb;
      }
      .al-info .al-title {
        color: #0c447c;
      }
      .al-info .al-msg {
        color: #185fa5;
      }
      .al-info .al-bar {
        background: #185fa5;
      }
      .al-info .al-close {
        color: #0c447c;
      }
    `,
  ],
})
export class AlertComponent {
  alertSvc = inject(AlertService);

  private ICONS: Record<string, string> = {
    error: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="currentColor"/></svg>`,
    success: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="9 11 12 14 22 4"/></svg>`,
    warning: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>`,
    info: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r=".5" fill="currentColor"/></svg>`,
  };

  icon(type: string): string {
    return this.ICONS[type] ?? this.ICONS['info'];
  }
}
