export interface ForumTopicWithCategory extends ForumTopic {
  category: ForumCategory;
}

export interface ForumTopic {
  id: number;
  category_id: number;
  last_posted_at: string;
  posts_count: number;
  slug: string;
  title: string;
  views: number;
}

export interface ForumCategory {
  color: string;
  id: number;
  name: string;
}

export interface ForumNotificationWithBadge extends ForumNotification {
  badge?: ForumBadge;
}

export interface ForumNotification {
  data?: any;
  id: number;
  post_number: number;
  notification_type: number;
  slug: string;
  fancy_title: string;
  topic_id: number;
}

export interface ForumBadge {
  fa_icon?: string;
  icon: string;
  id: number;
}

export enum ForumResourceType {
  BADGES = 'badges',
  CATEGORIES = 'categories',
  LATEST = 'latest',
  MARK_READ = 'mark-read',
  NOTIFICATIONS = 'notifications',
  TOPICS = 'topics',
}
