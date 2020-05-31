import { tap } from 'rxjs/operators';
import { TreeGroup, AtomicPosition } from './../../interfaces/tree';
import { Observable } from 'rxjs';
import { TreeService } from './../../services/tree.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LessonService } from 'src/app/services/lesson.service';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageOption } from './../../shared/input-image/input-image.component';
import {
  FormBuilder,
  FormArray,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Tree } from 'src/app/interfaces/tree';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
})
export class AtomicDialogComponent implements OnInit {
  form: FormGroup;
  image: string;
  meta: LessonMeta;
  tree: Tree;

  options: ImageOption = {
    label: true,
    contain: true,
    path: null,
    size: {
      width: 160,
      height: 160,
    },
  };

  atomicPosition: AtomicPosition;
  atomicGroupControl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AtomicDialogComponent>,
    private lessonService: LessonService,
    private treeService: TreeService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: FormGroup;
      meta?: LessonMeta;
    }
  ) {}

  ngOnInit(): void {
    this.meta = this.data.meta;
    this.form = this.data.form;

    if (this.meta) {
      this.options.path = `lessons/${this.meta.id}/icon`;
      if (this.meta.resources && !this.form.value.resources?.length) {
        this.meta.resources.forEach((resource) => this.addResource(resource));
      }
    }

    this.treeService.getTree().subscribe((tree) => (this.tree = tree));
  }

  get resourceControls(): FormArray {
    return this.form.get('resources') as FormArray;
  }

  addResource(data?: { title: string; url: string }) {
    this.resourceControls.push(
      this.fb.group({
        title: [data?.title, [Validators.required]],
        url: [data?.url, [Validators.required]],
      })
    );
  }

  setGroupData(atomicPosition: AtomicPosition) {
    this.atomicPosition = atomicPosition;
    const { sectionIndex, groupIndex } = atomicPosition;

    if (this.meta) {
      this.tree.sections.forEach((section) => {
        section.groups.forEach((group) => {
          if (group.atomicIds.includes(this.meta.id)) {
            group.atomicIds.splice(group.atomicIds.indexOf(this.meta.id), 1);
          }
        });
      });

      this.tree.sections[sectionIndex].groups[groupIndex].atomicIds.push(
        this.meta.id
      );

      this.treeService
        .updateTree(this.tree)
        .then(() => this.snackBar.open('ツリーに追加しました'));
    } else {
    }
  }

  removeResource(i: number) {
    this.resourceControls.removeAt(i);
    this.form.markAsDirty();
  }

  submit() {
    this.dialogRef.close({
      iconImage: this.image,
      atomicPosition: this.atomicPosition,
    });
  }

  sortResources(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.resourceControls.value,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(
      this.resourceControls.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.form.markAsDirty();
  }

  upload(iconURL: string) {
    if (this.meta) {
      this.lessonService
        .updateLesson(this.meta.id, {
          iconURL,
        })
        .then(() => {
          this.snackBar.open('画像を更新しました');
        });
    }
  }
}
