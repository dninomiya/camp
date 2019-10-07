import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/interfaces/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Output() delete = new EventEmitter();
  @Output() update = new EventEmitter();

  editMode: boolean;

  form = this.fb.group({
    body: ['', Validators.required]
  });

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit() {}

  editStart() {
    this.editMode = true;
    this.form.patchValue(this.comment);
  }

  updateComment() {
    this.editMode = false;
    this.update.emit({
      ...this.comment,
      ...this.form.value,
    });
  }

  deleteComment(id: string) {
    this.delete.emit(id);
  }

}
