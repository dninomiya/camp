import { User } from './user';

export interface Comment {
  id: string;
  body: string;
  author: User;
  updatedAt: Date;
}
