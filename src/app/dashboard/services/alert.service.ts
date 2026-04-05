import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration: number;
  closing: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private _alerts = new BehaviorSubject<Alert[]>([]);
  readonly alerts$ = this._alerts.asObservable();

  private readonly DURATIONS: Record<AlertType, number> = {
    error: 0,
    success: 4000,
    warning: 6000,
    info: 5000,
  };

  show(type: AlertType, title: string, message = '', duration?: number): void {
    const id = `a${Date.now()}${Math.random().toString(36).slice(2, 5)}`;
    const dur = duration ?? this.DURATIONS[type];
    const alert: Alert = {
      id,
      type,
      title,
      message,
      duration: dur,
      closing: false,
    };
    this._alerts.next([alert, ...this._alerts.getValue()]);
    if (dur > 0) setTimeout(() => this.dismiss(id), dur);
  }

  dismiss(id: string): void {
    this._alerts.next(
      this._alerts
        .getValue()
        .map((a) => (a.id === id ? { ...a, closing: true } : a)),
    );
    setTimeout(() => {
      this._alerts.next(this._alerts.getValue().filter((a) => a.id !== id));
    }, 350);
  }

  success(title: string, message = '') {
    this.show('success', title, message);
  }
  error(title: string, message = '') {
    this.show('error', title, message);
  }
  warning(title: string, message = '') {
    this.show('warning', title, message);
  }
  info(title: string, message = '') {
    this.show('info', title, message);
  }
}
