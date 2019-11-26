export interface ChannelMeta {
  readonly id: string;
  readonly email: string;

  authorId: string;
  title: string;
  coverURL?: string;
  avatarURL: string;
  description?: string;
  contact: string;
  links?: string[];
  createdAt: Date;
  totalRate?: number;
  statistics: ChannelStatistics;
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
  followerCount: number;
  lessonCount: number;
  reviewCount: number;
}

export interface Follower {
  uid: string;
}
