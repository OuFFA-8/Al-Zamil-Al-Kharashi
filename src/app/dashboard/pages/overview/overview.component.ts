import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { TeamDataService } from '../../../core/services/team-data/team-data.service';
import { EventDataService } from '../../../core/services/eventData/event-data.service';
import {
  ApiMessage,
  MessageService,
} from '../../../core/services/message/message.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class DashboardOverviewComponent implements OnInit {
  private msgSvc = inject(MessageService);
  private teamSvc = inject(TeamDataService);
  private blogSvc = inject(EventDataService);

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
  };

  recentMessages: ApiMessage[] = [];
  serviceStats: { _id: string; count: number }[] = [];

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
    }).subscribe({
      next: ({ msgStats, teamStats, blogsList, recentMsgs }) => {
        // Messages stats
        this.stats.totalMessages = msgStats.totalMessages;
        this.stats.unreadMessages = msgStats.unreadMessages;
        this.stats.todayMessages = msgStats.todayMessages;
        this.stats.thisWeekMessages = msgStats.thisWeekMessages;

        // Team stats
        this.stats.totalMembers = teamStats.allMembers;
        this.stats.activeMembers = teamStats.activeMembers;

        // Blogs stats
        this.stats.totalBlogs = blogsList.documentCounts;
        this.stats.publishedBlogs = blogsList.data.filter(
          (b) => b.status === 'published',
        ).length;

        // Recent messages
        this.recentMessages = recentMsgs.data.slice(0, 5);

        this.loading = false;
      },
      error: (err) => {
        console.error('Overview stats error:', err);
        this.loading = false;
      },
    });
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
