import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// ── Interfaces ──

export interface ApiMessage {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesListResponse {
  status: string;
  result: number;
  data: ApiMessage[];
  page: number;
  limit: number;
  documentCounts: number;
  totalPages: number;
}

export interface MessageResponse {
  status: string;
  data: ApiMessage;
}

export interface MessagesStats {
  totalMessages: number;
  unreadMessages: number;
  todayMessages: number;
  thisWeekMessages: number;
}

export interface MessagesStatsResponse {
  status: string;
  data: MessagesStats;
}

// ── Service ──

@Injectable({ providedIn: 'root' })
export class MessageService {
  private http = inject(HttpClient);
  readonly BASE_URL = 'http://api.zk-legal.com/api/v1';

  getMessages(
    page = 1,
    limit = 20,
    status = '',
    q = '',
  ): Observable<MessagesListResponse> {
    let url = `${this.BASE_URL}/messages?page=${page}&limit=${limit}&sort=-createdAt`;
    if (status) url += `&status=${status}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    return this.http.get<MessagesListResponse>(url);
  }

  getStats(): Observable<MessagesStats> {
    return this.http
      .get<MessagesStatsResponse>(`${this.BASE_URL}/admin/messages/stats`)
      .pipe(map((r) => r.data));
  }

  updateStatus(
    id: string,
    status: 'read' | 'unread' | 'replied',
  ): Observable<ApiMessage> {
    return this.http
      .patch<MessageResponse>(`${this.BASE_URL}/messages/${id}/status`, {
        status,
      })
      .pipe(map((r) => r.data));
  }

  addNotes(id: string, notes: string): Observable<ApiMessage> {
    return this.http
      .patch<MessageResponse>(`${this.BASE_URL}/messages/${id}`, { notes })
      .pipe(map((r) => r.data));
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/messages/${id}`);
  }

  createMessage(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
  }): Observable<ApiMessage> {
    return this.http
      .post<MessageResponse>(`${this.BASE_URL}/messages`, data)
      .pipe(map((r) => r.data));
  }
}
