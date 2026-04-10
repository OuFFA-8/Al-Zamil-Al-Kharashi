import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import {
  TranslatePipe,
  TranslateService,
  LangChangeEvent,
} from '@ngx-translate/core';
import {
  EventDataService,
  WorkItem,
} from '../../core/services/eventData/event-data.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './events.component.html',
  standalone: true,
  styleUrl: './events.component.css',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query('@itemAnimation', [stagger(100, [animate('300ms ease-out')])], {
          optional: true,
        }),
      ]),
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class EventsComponent implements OnInit, OnDestroy {
  private eventService = inject(EventDataService);
  private translateService = inject(TranslateService);
  private subscription: Subscription = new Subscription();

  workItems: WorkItem[] = [];
  loading = true;

  selectedEvent = signal<WorkItem | null>(null);
  isModalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.loading = true;

    this.subscription.add(
      this.translateService.onLangChange.subscribe(() => {
        this.eventService.refresh();
      }),
    );

    this.subscription.add(
      this.eventService.getEventsObservable().subscribe((events) => {
        this.workItems = events;
        this.loading = false;
      }),
    );
    this.eventService.refresh();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }

  openEventModal(event: WorkItem): void {
    this.selectedEvent.set(event);
    this.isModalOpen.set(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeEventModal(): void {
    this.isModalOpen.set(false);
    this.selectedEvent.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }

  getSelectedEvent(): WorkItem | null {
    return this.selectedEvent();
  }

  scrollToContent(event: MouseEvent): void {
    event.preventDefault();
    document
      .getElementById('content-area')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  getCurrentLanguage(): string {
    return this.translateService.currentLang || 'ar';
  }

  isArabic(): boolean {
    return this.getCurrentLanguage() === 'ar';
  }

  getTextDirection(): string {
    return this.isArabic() ? 'rtl' : 'ltr';
  }

  getTextAlignment(): string {
    return this.isArabic() ? 'right' : 'left';
  }
}
