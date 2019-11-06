import { Pipe, PipeTransform } from '@angular/core';
import { PlanType } from '../interfaces/plan';

@Pipe({
  name: 'planTitleLabel'
})
export class PlanTitleLabelPipe implements PipeTransform {

  transform(type: PlanType, ...args: any[]): any {
    switch (type) {
      case 'question':
        return '質問';
      case 'review':
        return 'ソースレビュー';
      case 'trouble':
        return 'トラブルシューティング';
      case 'coaching':
        return 'ライブコーチング';
      case 'premium':
        return 'ポスト見放題';
      case 'cause':
        return 'コース';
      case 'lesson':
        return 'ポスト';
    }
  }

}
