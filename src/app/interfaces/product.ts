import { User } from './user';
import { firestore } from 'firebase/app';
export interface Product {
  id: string;
  title: string;
  public: boolean;
  start: firestore.Timestamp;
  end?: firestore.Timestamp;
  description: string;
  github: string;
  url: string;
  thumbnailURL?: string;
  twitter?: string;
  status: 'progress' | 'complete';
  authorId: string;
  links?: {
    title: string;
    url: string;
  }[];
}

export interface ProductWithAuthor extends Product {
  author: User;
}
