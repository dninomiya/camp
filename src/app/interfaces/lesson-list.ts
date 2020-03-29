export interface LessonList {
  readonly id: string;
  readonly authorId: string;
  readonly createdAt: Date;
  title: string;
  lessonIds: string[];
  description: string;
  coverURL?: string;
  firstLessonId?: string;
}
