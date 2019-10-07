import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Plan } from 'src/app/interfaces/plan';
import { MatDialogRef } from '@angular/material';
import { ForumService } from 'src/app/services/forum.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent implements OnInit {

  @Input() params: {
    plan: Plan,
    targetId: string,
    authorId: string
  };

  @Output() data = new EventEmitter();

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  submit() {
    this.data.emit(this.form.value);
  }

}
