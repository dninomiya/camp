import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-help',
  templateUrl: './editor-help.component.html',
  styleUrls: ['./editor-help.component.scss'],
})
export class EditorHelpComponent implements OnInit {
  helps: {
    title: string;
    description: string;
    code?: string;
  }[] = [
    {
      title: 'マークダウンが使えます',
      description: 'シンタックスハイライトつきのコードも利用可能です。',
    },
    {
      title: '画像のペーストが可能',
      description:
        'ツールバーから画像のアップロードが可能ですが、ペーストでも同様にアップロードできます。',
    },
    {
      title: 'ノート',
      description: '3種類の見た目が存在します',
      code: `
      \`\`\`note
      ノート
      \`\`\`

      \`\`\`notice
      注意
      \`\`\`

      \`\`\`denger
      危険
      \`\`\``,
    },
    {
      title: 'Do / Dont',
      description: '推奨非推奨',
      code: `
      \`\`\`do
      推奨
      \`\`\`

      \`\`\`dont
      非推奨
      \`\`\``,
    },
    {
      title: 'コード',
      description: '様々な言語に対応（ファイル名.言語）',
      code: `
      \`\`\`example.ts
      const lang = 'ts';
      \`\`\`

      \`\`\`scss
      body {
        font-size: 14px;
      }
      \`\`\`

      \`\`\`example.html
      <p>lorem</p>
      \`\`\``,
    },
  ];

  constructor() {
    this.helps = this.helps.map((help) => {
      if (help.code) {
        return {
          ...help,
          code: help.code.replace(/^ +/gm, '').replace(/^\n/, ''),
        };
      }

      return help;
    });
  }

  ngOnInit() {}
}
