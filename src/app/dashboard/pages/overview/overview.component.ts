import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { TeamDataService } from '../../../core/services/team-data/team-data.service';
import { EventDataService } from '../../../core/services/eventData/event-data.service';
import {
  ApiMessage,
  MessageService,
} from '../../../core/services/message/message.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  private msgSvc = inject(MessageService);
  private teamSvc = inject(TeamDataService);
  private blogSvc = inject(EventDataService);
  private http = inject(HttpClient);

  @ViewChild('visitsChart') visitsChartRef!: ElementRef<HTMLCanvasElement>;
  private visitsChart: Chart | null = null;

  loading = true;

  stats = {
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0,
    thisWeekMessages: 0,
    totalMembers: 0,
    activeMembers: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalVisits: 0,
    todayVisits: 0,
  };

  recentMessages: ApiMessage[] = [];
  visitsByCountry: { _id: string; count: number }[] = [];

  statCards = [
    {
      key: 'totalMessages',
      label: 'overview.total_messages',
      icon: 'mail',
      color: 'blue',
    },
    {
      key: 'unreadMessages',
      label: 'overview.unread_messages',
      icon: 'mail-alert',
      color: 'amber',
    },
    {
      key: 'totalMembers',
      label: 'overview.team_members',
      icon: 'users',
      color: 'purple',
    },
    {
      key: 'activeMembers',
      label: 'overview.active_members',
      icon: 'check',
      color: 'green',
    },
    {
      key: 'todayMessages',
      label: 'overview.today_messages',
      icon: 'today',
      color: 'teal',
    },
    {
      key: 'thisWeekMessages',
      label: 'overview.week_messages',
      icon: 'week',
      color: 'coral',
    },
    {
      key: 'totalBlogs',
      label: 'overview.total_blogs',
      icon: 'calendar',
      color: 'pink',
    },
    {
      key: 'publishedBlogs',
      label: 'overview.published_blogs',
      icon: 'published',
      color: 'green',
    },
  ];

  ngOnInit(): void {
    forkJoin({
      msgStats: this.msgSvc.getStats(),
      teamStats: this.teamSvc.getMembersStats(),
      blogsList: this.blogSvc.getBlogs(1, 100),
      recentMsgs: this.msgSvc.getMessages(1, 5),
      visits: this.http
        .get<any>('https://api.zk-legal.com/api/v1/admin/visits')
        .pipe(
          catchError(() =>
            of({ data: { totalVisits: 0, todayVisits: 0, byCountry: [] } }),
          ),
        ),
    }).subscribe({
      next: ({ msgStats, teamStats, blogsList, recentMsgs, visits }) => {
        this.stats.totalMessages = msgStats.totalMessages;
        this.stats.unreadMessages = msgStats.unreadMessages;
        this.stats.todayMessages = msgStats.todayMessages;
        this.stats.thisWeekMessages = msgStats.thisWeekMessages;
        this.stats.totalMembers = teamStats.allMembers;
        this.stats.activeMembers = teamStats.activeMembers;
        this.stats.totalBlogs = blogsList.documentCounts;
        this.stats.publishedBlogs = blogsList.data.filter(
          (b) => b.status === 'published',
        ).length;
        this.stats.totalVisits = visits.data.totalVisits;
        this.stats.todayVisits = visits.data.todayVisits;
        this.visitsByCountry = visits.data.byCountry || [];
        this.recentMessages = recentMsgs.data.slice(0, 5);
        this.loading = false;
        setTimeout(() => this.initVisitsChart(), 100);
      },
      error: (err) => {
        console.error('Overview stats error:', err);
        this.loading = false;
      },
    });
  }

  private initVisitsChart(): void {
    if (!this.visitsChartRef) return;
    const ctx = this.visitsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.visitsChart) this.visitsChart.destroy();

    this.visitsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['زيارات اليوم', 'باقي الزيارات'],
        datasets: [
          {
            data: [
              this.stats.todayVisits,
              Math.max(0, this.stats.totalVisits - this.stats.todayVisits),
            ],
            backgroundColor: ['#3396d8', '#eeedfe'],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeInOutQuart',
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.visitsChart) this.visitsChart.destroy();
  }

  getCountryName(name: string): string {
    const countries: Record<string, string> = {
      Egypt: 'مصر',
      'Saudi Arabia': 'السعودية',
      'United Arab Emirates': 'الإمارات',
      Kuwait: 'الكويت',
      Qatar: 'قطر',
      Bahrain: 'البحرين',
      Oman: 'عُمان',
      Jordan: 'الأردن',
      Lebanon: 'لبنان',
      Iraq: 'العراق',
      Syria: 'سوريا',
      Yemen: 'اليمن',
      Morocco: 'المغرب',
      Tunisia: 'تونس',
      Algeria: 'الجزائر',
      Libya: 'ليبيا',
      Sudan: 'السودان',
      'United States': 'أمريكا',
      'United Kingdom': 'بريطانيا',
      Germany: 'ألمانيا',
      France: 'فرنسا',
      Turkey: 'تركيا',
      India: 'الهند',
      Pakistan: 'باكستان',
    };
    return countries[name] || name;
  }

  getCountryCode(name: string): string {
    const codes: Record<string, string> = {
      Egypt: 'eg',
      'Saudi Arabia': 'sa',
      'United Arab Emirates': 'ae',
      Kuwait: 'kw',
      Qatar: 'qa',
      Bahrain: 'bh',
      Oman: 'om',
      Jordan: 'jo',
      Lebanon: 'lb',
      Iraq: 'iq',
      Syria: 'sy',
      Yemen: 'ye',
      Morocco: 'ma',
      Tunisia: 'tn',
      Algeria: 'dz',
      Libya: 'ly',
      Sudan: 'sd',
      'United States': 'us',
      'United Kingdom': 'gb',
      Germany: 'de',
      France: 'fr',
      Turkey: 'tr',
      India: 'in',
      Pakistan: 'pk',
      China: 'cn',
      Russia: 'ru',
      Italy: 'it',
      Spain: 'es',
      Canada: 'ca',
      Australia: 'au',
      Japan: 'jp',
      'South Korea': 'kr',
      Brazil: 'br',
      Mexico: 'mx',
      Netherlands: 'nl',
      Belgium: 'be',
      Sweden: 'se',
      Norway: 'no',
    };
    return codes[name] || 'un';
  }

  getCountryPct(count: number): number {
    const total = this.visitsByCountry.reduce((s, c) => s + c.count, 0);
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  getStatValue(key: string): number {
    return (this.stats as any)[key] ?? 0;
  }

  getFullName(msg: ApiMessage): string {
    return `${msg.first_name} ${msg.last_name}`;
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-SA');
  }

  getInitials(msg: ApiMessage): string {
    return (msg.first_name?.[0] || '') + (msg.last_name?.[0] || '');
  }

  getTotalForDonut(): number {
    return (
      this.stats.totalMessages + this.stats.totalMembers + this.stats.totalBlogs
    );
  }

  getLegPct(val: number): number {
    const total = this.getTotalForDonut();
    return total > 0 ? Math.round((val / total) * 100) : 0;
  }

  getSegDash(val: number, _i: number): string {
    const total = this.getTotalForDonut();
    const circ = 302;
    const dash = total > 0 ? (val / total) * circ : 0;
    return `${Math.round(dash)} ${circ}`;
  }

  getSegOffset(segIndex: number): number {
    const circ = 302;
    const total = this.getTotalForDonut();
    if (total === 0) return 75;
    const vals = [
      this.stats.totalMessages,
      this.stats.totalMembers,
      this.stats.totalBlogs,
      this.stats.unreadMessages,
    ];
    let accumulated = 0;
    for (let i = 0; i < segIndex; i++) accumulated += (vals[i] / total) * circ;
    return -(accumulated - 75);
  }
}
