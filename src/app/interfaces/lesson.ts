import { firestore } from 'firebase/app';
import { ChannelMeta } from './channel';

export interface LessonMeta {
  readonly id: string;
  readonly createdAt: firestore.Timestamp;
  readonly viewCount: number;
  readonly channelId: string;
  readonly traction?: LessonTraction;
  readonly deleted: boolean;
  readonly updatedAt: firestore.Timestamp;
  readonly authorId: string;
  readonly thumbnailURL?: string;
  readonly iconURL?: string;

  title: string;
  videoId?: string;
  public: boolean;
  free: boolean;
  tags?: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}

export interface LessonTraction {
  day: {
    updatedAt: Date;
    count: number;
  };
  week: {
    updatedAt: Date;
    count: number;
  };
  month: {
    updatedAt: Date;
    count: number;
  };
}

export interface LessonBody {
  body: string;
}

export interface Lesson extends LessonMeta, LessonBody {}

export interface LessonMetaWithChannel extends LessonMeta {
  author: ChannelMeta;
}
