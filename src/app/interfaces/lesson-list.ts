export interface LessonList {
  readonly id: string;
  readonly authorId: string;
  readonly createdAt: Date;
  title: string;
  lessonIds: string[];
  private?: boolean;
  description: string;
  premium?: boolean;
  amount?: number;
  coverURL?: string;
  firstLessonId?: string;
}
