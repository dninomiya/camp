import { TreeItem } from './../../interfaces/tree';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageOption } from './../../shared/input-image/input-image.component';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
})
export class ItemDialogComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required]],
    lessonId: ['', [Validators.required]],
    resources: this.fb.array([]),
  });
  image: string;

  options: ImageOption = {
    label: true,
    crop: true,
    size: {
      width: 160,
      height: 160,
    },
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item?: TreeItem
  ) {}

  ngOnInit(): void {
    if (this.item) {
      this.form.patchValue(this.item);

      if (this.item.resources) {
        this.item.resources.forEach((resource) => this.addResource(resource));
      }
    }
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

  removeResource(i: number) {
    this.resourceControls.removeAt(i);
  }

  submit() {
    this.dialogRef.close({
      data: this.form.value,
      image: this.image,
    });
  }
}
