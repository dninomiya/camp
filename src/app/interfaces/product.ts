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
  author: {
    id: string;
    name: string;
    avatarURL: string;
  };
  links?: {
    title: string;
    url: string;
  }[];
}
