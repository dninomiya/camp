export interface TreeSections {
  sectionIds: string[];
}

export interface TreeSection {
  id: string;
  title: string;
  group: {
    [keyName: string]: TreeGroup;
  };
  groupIds: string[];
}

export interface TreeGroup {
  id: string;
  title: string;
  item: {
    [keyName: string]: TreeItem;
  };
  itemIds: string[];
}

export interface TreeItem {
  id: string;
  title: string;
  iconURL: string;
  lessonId: string;
  resources?: {
    title: string;
    url: string;
  }[];
}
