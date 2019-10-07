import { PlanType } from './plan';
import { Lesson } from './lesson';

export interface Settlement {
  readonly createdAt: Date;
  readonly targetId?: string;
  readonly lesson?: Lesson;
  readonly title?: string;

  amount: number;
  userId: string;
  channelId: string;
  contentId: string;
  type: 'lesson' | 'cause' | PlanType;
}
