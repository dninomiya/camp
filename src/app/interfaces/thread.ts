import { ChannelMeta } from './channel';
import { Plan } from './plan';

export interface Thread {
  readonly id: string;
  readonly createdAt: Date;

  authorId: string;
  title: string;
  body: string;
  targetId: string;
  user: ChannelMeta;
  status: ThreadStatus;
  plan: Plan;
  sellerEmail: string;
  isComplete?: boolean;
  isReject?: boolean;
  rejectReason: string;
  unreadCount?: {
    [key: string]: number;
  };
}

export interface ThreadReply {
  authorId: string;
  threadId: string;
  body: string;
  createdAt: Date;
  author: ChannelMeta;
  thread: Thread;
}

export type ThreadStatus = 'request' | 'open' | 'closed';

export interface ForumUnreadCount {
  request: number;
  open: number;
}

export const REJECT_REASON_TEMPLATE = [
  {
    label: '曖昧な内容',
    value: 'ambiguous'
  },
  {
    label: '過剰な内容',
    value: 'heavy'
  },
  {
    label: 'マナー違反',
    value: 'manners'
  },
  {
    label: '対象範囲外',
    value: 'scope'
  },
  {
    label: 'スケジュール',
    value: 'manners'
  },
  {
    label: '自己解決',
    value: 'self'
  },
  {
    label: 'その他',
    value: 'other'
  },
];
