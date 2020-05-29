import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TreeItem } from './../interfaces/tree';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TreeService } from './../services/tree.service';
import { Component, OnInit } from '@angular/core';
import { TreeSection, TreeGroup } from '../interfaces/tree';

@Component({
  selector: 'app-tree-editor',
  templateUrl: './tree-editor.component.html',
  styleUrls: ['./tree-editor.component.scss'],
})
export class TreeEditorComponent implements OnInit {
  sections: TreeSection[];
  activeSection: TreeSection;
  activeGroup: TreeGroup;
  private allSections$ = this.treeService.getAllSections();

  constructor(
    private treeService: TreeService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    combineLatest([this.route.queryParamMap, this.allSections$]).subscribe(
      ([map, sections]) => {
        this.sections = sections;

        const sectionId = map.get('sectionId');
        if (sectionId) {
          this.activeSection = this.sections.find(
            (section) => section.id === sectionId
          );
        } else {
          this.router.navigate([], {
            queryParams: {
              sectionId: sections[0].id,
              groupId: sections[0].groupIds[0],
            },
          });
        }

        const groupId = map.get('groupId');
        if (groupId) {
          this.activeGroup = this.activeSection.group[groupId];
        }

        const itemId = map.get('itemId');
        if (itemId && this.activeSection && this.activeGroup) {
          this.openItemDialog(this.activeGroup.item[itemId]);
        }
      }
    );
  }

  ngOnInit(): void {}

  addSection(title: string) {
    this.treeService.addSection({
      title,
      group: {},
      groupIds: [],
    });
  }

  updateSection(title: string) {
    this.treeService.updateSection({
      ...this.activeSection,
      title,
    });
  }

  addGroup(title: string) {
    this.treeService.addGroup(
      {
        title,
        item: {},
        itemIds: [],
      },
      this.activeSection.id
    );
  }

  updateGroup(title: string) {
    this.treeService
      .updateGroup(
        {
          ...this.activeGroup,
          title,
        },
        this.activeSection.id
      )
      .then(() => {
        this.activeGroup = Object.assign({}, this.activeGroup);
      });
  }

  addItem(data: TreeItem, image: string) {
    this.treeService.addItem(
      this.activeSection.id,
      this.activeGroup.id,
      data,
      image
    );
  }

  sortSection(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    this.treeService.updateSectionOrder(
      this.sections.map((section) => section.id)
    );
  }

  sortGroup(event: CdkDragDrop<string[]>, ids: string[]) {
    moveItemInArray(ids, event.previousIndex, event.currentIndex);
    this.treeService.updateGroupOrder(this.activeSection.id, ids);
  }

  sortItem(event: CdkDragDrop<string[]>, ids: string[]) {
    moveItemInArray(ids, event.previousIndex, event.currentIndex);
    this.treeService.updateItemOrder(
      this.activeSection.id,
      this.activeGroup.id,
      ids
    );
  }

  deleteGroup() {
    this.treeService.deleteGroup(this.activeSection.id, this.activeGroup.id);
  }

  deleteItem(itemId: string) {
    this.treeService.deleteItem(
      this.activeSection.id,
      this.activeGroup.id,
      itemId
    );
  }

  deleteSection() {
    this.treeService.deleteSection(this.activeSection.id);
  }

  setFocus(elm) {
    setTimeout(() => {
      elm.focus();
    }, 100);
  }

  updateItem(data: TreeItem, image: string) {
    this.treeService.updateItem(
      this.activeSection.id,
      this.activeGroup.id,
      data,
      image
    );
  }

  openTitleDialog(target: string, oldTitle?: string) {
    this.dialog
      .open(InputDialogComponent, {
        data: oldTitle,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          switch (target) {
            case 'section':
              oldTitle ? this.updateSection(data) : this.addSection(data);
              break;
            case 'group':
              oldTitle ? this.updateGroup(data) : this.addGroup(data);
              break;
          }
        }
      });
  }

  openItemDialog(oldItem?: TreeItem) {
    this.dialog
      .open(ItemDialogComponent, {
        data: oldItem,
        width: '800px',
        autoFocus: true,
      })
      .afterClosed()
      .subscribe((result) => {
        this.router.navigate([], {
          queryParams: {
            itemId: null,
          },
          queryParamsHandling: 'merge',
        });

        if (!result) return;

        if (oldItem) {
          this.updateItem(
            {
              ...oldItem,
              ...result.data,
            },
            result.image
          );
        } else {
          this.addItem(result.data, result.image);
        }
      });
  }
}
