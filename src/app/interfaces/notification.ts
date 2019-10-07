import { firestore } from 'firebase/app';

export interface Notification {
  id: string;
  title: string;
  url?: string;
  point?: number;
  isRead: boolean;
  createdAt: firestore.Timestamp;
}
