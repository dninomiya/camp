export interface ChannelMeta {
  readonly id: string;
  readonly email: string;

  authorId: string;
  title: string;
  coverURL: string;
  followerCount: number;
  avatarURL: string;
  description?: string;
  contact: string;
  lessonCount: number;
  links?: string[];
  createdAt: Date;
  reviewCount?: number;
  totalRate?: number;
  statistics?: ChannelStatistics;
  ads?: {
    public?: boolean;
    url?: string;
    imageURL: string;
  };
  unreadThread: {
    open: number;
    closed: number;
    request: number;
  };
}

export interface ChannelStatistics {
  totalLikeCount: number;
  totalLikedCount: number;
  publicLessonCount: number;
}

export interface Follower {
  uid: string;
}
