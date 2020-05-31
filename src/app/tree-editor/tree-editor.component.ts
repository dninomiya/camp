import { MatSnackBar } from '@angular/material/snack-bar';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { LessonService } from 'src/app/services/lesson.service';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TreeService } from './../services/tree.service';
import { Component, OnInit } from '@angular/core';
import { TreeSection, TreeGroup, Tree } from '../interfaces/tree';

@Component({
  selector: 'app-tree-editor',
  templateUrl: './tree-editor.component.html',
  styleUrls: ['./tree-editor.component.scss'],
})
export class TreeEditorComponent implements OnInit {
  tree: Tree;
  activeGroup: TreeGroup;
  activeSection: TreeSection;
  atomic: {
    [keyName: string]: LessonMeta;
  };

  constructor(
    private treeService: TreeService,
    private lessonService: LessonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.treeService.getTree().subscribe((tree) => {
      this.tree = tree;
      this.activeSection = tree.sections[0];
    });
  }

  addSection(title: string) {
    this.tree.sections.push({
      title,
      groups: [],
    });
  }

  addGroup(title: string) {
    this.activeSection.groups.push({
      title,
      atomicIds: [],
    });
  }

  addItem(id: string) {
    this.activeGroup.atomicIds.push(id);
  }

  sortSection(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.tree.sections,
      event.previousIndex,
      event.currentIndex
    );
  }

  sortGroup(event: CdkDragDrop<string[]>, groups: TreeGroup[]) {
    moveItemInArray(groups, event.previousIndex, event.currentIndex);
  }

  sortItem(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.activeGroup.atomicIds,
      event.previousIndex,
      event.currentIndex
    );
  }

  deleteGroup(index: number) {
    this.activeSection.groups.splice(index, 1);
    this.activeGroup = null;
  }

  deleteItem(i: number) {
    this.activeGroup.atomicIds.splice(i, 1);
  }

  deleteSection(i: number) {
    this.tree.sections.splice(i, 1);
  }

  openTitleDialog(target: 'section' | 'group', oldTitle?: string) {
    this.dialog
      .open(InputDialogComponent, {
        data: oldTitle,
      })
      .afterClosed()
      .subscribe((title) => {
        if (title) {
          switch (target) {
            case 'section':
              oldTitle
                ? (this.activeSection.title = title)
                : this.addSection(title);
              break;
            case 'group':
              oldTitle
                ? (this.activeGroup.title = title)
                : this.addGroup(title);
              break;
          }
          this.updateTree();
        }
      });
  }

  private updateTree() {
    this.treeService
      .updateTree(this.tree)
      .then(() => this.snackBar.open('ツリーを更新しました'));
  }

  selectGroup(group: TreeGroup) {
    this.activeGroup = group;
    this.lessonService
      .getLessonMetasByIds(group.atomicIds)
      .subscribe((atomics) => {
        this.atomic = atomics.reduce((obj, atomic) => {
          obj[atomic.id] = atomic;
          return obj;
        }, {});
      });
  }
}
