import { Router } from '@angular/router';
import { Product } from './../interfaces/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from './../services/product.service';
import { AuthService } from './../services/auth.service';
import { firestore } from 'firebase/app';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required]],
    public: [true, [Validators.required]],
    start: ['', [Validators.required]],
    end: [''],
    description: ['', [Validators.required]],
    github: [
      '',
      [Validators.required, Validators.pattern('^https://github.com/.*')],
    ],
    url: ['', [Validators.required, Validators.pattern('^https?://.*')]],
    twitter: [
      '',
      [Validators.required, Validators.pattern('^https://twitter.com/.*')],
    ],
    status: ['progress', [Validators.required]],
    links: this.fb.array([]),
  });

  image: string;
  oldSrc: string;
  imageOptions = {
    size: {
      width: 800,
      height: 400,
    },
    crop: true,
  };

  get links(): FormArray {
    return this.form.get('links') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.productService
      .getProduct(this.authService.user.id)
      .subscribe((product) => {
        if (product) {
          this.form.patchValue({
            ...product,
            start: product.start && moment(product.start.toDate()),
            end: product.end && moment(product.end.toDate()),
          });
        }
      });
  }

  ngOnInit(): void {}

  private getTimestamp(date: moment.Moment): firestore.Timestamp {
    return firestore.Timestamp.fromDate(date.toDate());
  }

  submit() {
    const value = this.form.value;
    const data = {
      title: value.title,
      public: value.public,
      start: value.start && this.getTimestamp(value.start),
      end: value.end && this.getTimestamp(value.end),
      description: value.description,
      github: value.github,
      url: value.url,
      twitter: value.twitter,
      authorId: this.authService.user.id,
      status: value.status,
      links: value.links,
    };

    this.productService
      .saveProduct(this.authService.user.id, data, this.image)
      .then(() => {
        this.snackBar.open('プロジェクトを保存しました');
        this.router.navigateByUrl('/projects');
      });
  }

  addLink() {
    this.links.push(
      this.fb.group({
        title: ['', Validators.required],
        url: ['', [Validators.required, Validators.pattern('^https?://.*')]],
      })
    );
  }

  getFile(image: string) {
    this.image = image;
  }
}
