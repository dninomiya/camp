import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import {
  DiffMatchPatch,
  Diff,
  DiffOperation,
} from 'diff-match-patch-typescript';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.scss'],
})
export class DiffComponent implements OnInit {
  diffs: {
    type: 'insert' | 'delete' | 'equal';
    value: string;
  }[];
  diffOperation: typeof DiffOperation = DiffOperation;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      oldDoc: string;
      newDoc: string;
    }
  ) {}

  ngOnInit(): void {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(this.data.oldDoc, this.data.newDoc);
    dmp.diff_cleanupSemantic(diffs);
    this.diffs = diffs.map((diff) => {
      let type: 'insert' | 'delete' | 'equal';
      switch (diff[0]) {
        case DiffOperation.DIFF_INSERT:
          type = 'insert';
          break;
        case DiffOperation.DIFF_DELETE:
          type = 'delete';
          break;
        case DiffOperation.DIFF_EQUAL:
          type = 'equal';
          break;
      }

      return {
        type,
        value: diff[1],
      };
    });
  }
}
