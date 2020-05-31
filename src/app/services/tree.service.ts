import { StorageService } from './storage.service';
import { firestore } from 'firebase/app';
import {
  Tree,
  TreeSection,
  TreeGroup,
  AtomicPosition,
} from './../interfaces/tree';
import { switchMap, take, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor(
    private db: AngularFirestore,
    private storageService: StorageService
  ) {}

  getTree(): Observable<Tree> {
    return this.db.doc<Tree>('core/tree').valueChanges().pipe(take(1));
  }

  updateTree(tree: Tree): Promise<void> {
    return this.db.doc<Tree>('core/tree').set(tree, { merge: true });
  }

  async updateTreeWithPosition(position: AtomicPosition, id: string) {
    const tree = await this.getTree().toPromise();
    tree.sections[position.sectionIndex].groups[
      position.groupIndex
    ].atomicIds.push(id);
    return this.updateTree(tree);
  }

  getAllSections(): Observable<TreeSection[]> {
    return this.db
      .doc<TreeSections>('core/section')
      .valueChanges()
      .pipe(
        switchMap((tree) => {
          if (tree.sectionIds?.length) {
            return combineLatest(
              tree.sectionIds.map((id) => this.getSection(id))
            );
          } else {
            return of([]);
          }
        })
      );
  }

  getSection(id: string): Observable<TreeSection> {
    return this.db.doc<TreeSection>(`sections/${id}`).valueChanges();
  }

  addSection(section: Omit<TreeSection, 'id'>): Promise<void[]> {
    const id = this.db.createId();
    const sectionPromise = this.db
      .doc<TreeSection>(`sections/${id}`)
      .set({ ...section, id });
    const treePromise = this.db.doc('core/section').update({
      sectionIds: firestore.FieldValue.arrayUnion(id),
    });
    return Promise.all([sectionPromise, treePromise]);
  }

  updateSection(tree: TreeSection): Promise<void> {
    return this.db.doc<TreeSection>(`sections/${tree.id}`).update(tree);
  }

  deleteSection(id: string): Promise<void[]> {
    const sectionPromise = this.db.doc<TreeSection>(`sections/${id}`).delete();
    const treePromise = this.db.doc('core/section').update({
      sectionIds: firestore.FieldValue.arrayRemove(id),
    });
    return Promise.all([sectionPromise, treePromise]);
  }

  deleteGroup(sectionId: string, groupId: string): Promise<void> {
    const key = `group.${groupId}`;

    return this.db.doc(`sections/${sectionId}`).update({
      [key]: firestore.FieldValue.delete(),
      groupIds: firestore.FieldValue.arrayRemove(groupId),
    });
  }

  addGroup(group: Omit<TreeGroup, 'id'>, sectionId: string): Promise<void> {
    const id = this.db.createId();
    const key = `group.${id}`;
    return this.db.doc(`sections/${sectionId}`).update({
      [key]: { ...group, id },
      groupIds: firestore.FieldValue.arrayUnion(id),
    });
  }

  updateGroup(group, sectionId: string): Promise<void> {
    const key = `group.${group.id}`;
    return this.db.doc(`sections/${sectionId}`).update({
      [key]: group,
    });
  }

  async addItem(
    sectionId: string,
    groupId: string,
    item: Omit<TreeItem, 'id'>,
    image: string
  ): Promise<void> {
    const id = this.db.createId();
    const key = `group.${groupId}.item.${id}`;
    const idsKey = `group.${groupId}.itemIds`;

    const iconURL = await this.storageService.upload(`items/${id}`, image);

    return this.db.doc(`sections/${sectionId}`).update({
      [key]: {
        id,
        iconURL,
        ...item,
      },
      [idsKey]: firestore.FieldValue.arrayUnion(id),
    });
  }

  async updateItem(
    sectionId: string,
    groupId: string,
    item: TreeItem,
    image?: string
  ): Promise<void> {
    let iconURL: string = item.iconURL;
    if (image) {
      iconURL = await this.storageService.upload(`items/${item.id}`, image);
    }

    const key = `group.${groupId}.item.${item.id}`;
    return this.db.doc(`sections/${sectionId}`).update({
      [key]: {
        ...item,
        iconURL,
      },
    });
  }

  deleteItem(
    sectionId: string,
    groupId: string,
    itemId: string
  ): Promise<void> {
    const key = `group.${groupId}.item.${itemId}`;
    const idsKey = `group.${groupId}.itemIds`;
    return this.db.doc(`sections/${sectionId}`).update({
      [key]: firestore.FieldValue.delete(),
      [idsKey]: firestore.FieldValue.arrayRemove(itemId),
    });
  }

  removeItem(
    sectionId: string,
    groupId: string,
    itemId: TreeItem
  ): Promise<void> {
    const key = `group.${groupId}.items`;
    return this.db.doc(`sections/${sectionId}`).update({
      [key]: firestore.FieldValue.arrayUnion(itemId),
    });
  }

  updateSectionOrder(sectionIds: string[]) {
    this.db.doc(`core/section`).update({
      sectionIds,
    });
  }

  updateGroupOrder(sectionId: string, groupIds: string[]) {
    this.db.doc(`sections/${sectionId}`).update({
      groupIds,
    });
  }

  updateItemOrder(sectionId: string, groupId: string, itemIds: string[]) {
    const key = `group.${groupId}.itemIds`;
    this.db.doc(`sections/${sectionId}`).update({
      [key]: itemIds,
    });
  }

  getSectionAndGroupByItemId(sections: TreeSection[], id: string) {
    const result = {
      sectionId: null,
      groupId: null,
    };
    sections.some((section) => {
      Object.values(section.group).some((group) => {
        if (group.item[id]) {
          result.sectionId = section.id;
          result.groupId = group.id;
          return true;
        }
      });
      return !!result.sectionId;
    });
  }
}
