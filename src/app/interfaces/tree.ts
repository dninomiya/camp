import { LessonMeta } from 'src/app/interfaces/lesson';
export interface Tree {
  sections: TreeSection[];
}

export interface TreeSection {
  title: string;
  groups: TreeGroup[];
}

export interface TreeGroup {
  title: string;
  atomicIds: string[];
}

export interface AtomicPosition {
  sectionIndex: number;
  groupIndex: number;
}
