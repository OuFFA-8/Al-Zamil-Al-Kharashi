export interface TeamMember {
  _id: string;
  member_id: string;
  name_ar: string;
  name_en: string;
  title_ar: string;
  title_en: string;
  bio_title_ar: string;
  bio_title_en: string;
  bio_text_ar: string;
  bio_text_en: string;
  email: string;
  phone: string;
  website: string;
  specializations: string[];
  status: 'active' | 'inactive';
  displayOrder: number;
  photo?: string; // ← الاسم الحقيقي في الـ API
  imageUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'read' | 'unread';
  date: string;
}

export interface Event {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  date: string;
  location: string;
  image: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  todayMessages: number;
  thisWeekMessages: number;
  totalTeamMembers: number;
  activeMembers: number;
  seniorMembers: number;
  totalEvents: number;
  publishedEvents: number;
}

export interface AdminUser {
  _id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
