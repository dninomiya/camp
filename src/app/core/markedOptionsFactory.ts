import { MarkedRenderer, MarkedOptions } from 'ngx-markdown';
import * as marked from 'marked';

const codeLabel = {
  ts: 'TypeScript',
  js: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  bash: 'ターミナル',
};

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  // tslint:disable-next-line: quotemark
  "'": '&#39;',
  '/': '&#x2F;',
};

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  renderer.paragraph = (text) => {
    let newText = text.replace(/\n/g, '<br>\n');
    if (newText.startsWith('<figure') && newText.endsWith('</figure>')) {
      return newText;
    } else {
      newText = newText.replace(/(\d\d:\d\d)/gm, '<a class="seek">$1</a>');
      return '<p>' + newText + '</p>';
    }
  };

  renderer.heading = (text, level, raw, slugger) => {
    const href = location.href.replace(/#.*$/, '');
    return `<h${level} id="${text}">${text}<a href="${href}#${text}" class="material-icons">link</a></h${level}>`;
  };

  renderer.html = (html) => {
    const gist = html && html.match(/https:\/\/gist\.github\.com.*\.js/m);
    if (gist) {
      return `<iframe frameborder=0 style="height: 460px;" scrolling="no" seamless="seamless" srcdoc='<html><body><style type="text/css">.gist .gist-data { height: 400px; }</style><script src="${gist[0]}"></script></body></html>'></iframe>`;
    } else {
      return html;
    }
  };

  renderer.link = (href: string, title: string, text: string) => {
    if (/http/.test(href)) {
      return `<a target="_blank" rel="noopener" href="${href}">${text}</a><i class="material-icons">open_in_new</i>`;
    } else if (/zip/.test(href)) {
      return `<a target="_blank" rel="noopener" href="${href}">${text}</a><i class="material-icons">cloud_download
      </i>`;
    } else {
      return `<a data-link="${href}">${text}</a>`;
    }
  };
  renderer.image = (href: string, title: string, text: string) => {
    const caption = title ? `<figcaption>${title}</figcaption>` : '';
    return `<figure><a href="${href}" target="_blank"><img src="${href}"></a>${caption}</figure>`;
  };
  renderer.code = (t: string, l: string) => {
    let lang = l;
    let label = lang;
    if (/.+\..+$/.test(l)) {
      const parts = l.split('.');
      lang = parts[parts.length - 1];
    }

    label = codeLabel[label] || label;

    let text = t;

    const info = lang && lang.match(/note|denger|notice/);
    const dod = label && label.match(/dont|do/);

    if (label === 'ogp_export') {
      return text;
    }

    text = text.replace(/[&<>"'\/]/g, (key) => entityMap[key]);

    if (info) {
      return `<div class="info info--${info[0]}">${marked(text, {
        renderer,
      })}</div>`;
    } else if (dod) {
      const dodLabel = dod[0] === 'do' ? 'Do' : "Don't";
      return (
        `<pre class="language-${lang} ${dod[0]}">` +
        `<span class="lang">${dodLabel}</span><code class="language-${lang}">` +
        text +
        '</code></pre>'
      );
    } else if (lang) {
      if (/editorconfig|gitignore/.test(lang)) {
        lang = 'bash';
      }
      return (
        `<pre class="language-${lang}"><span class="lang">${label}</span><code class="language-${lang}">` +
        text +
        '</code></pre>'
      );
    } else {
      return `<pre class="no-lang"><code>` + text + '</code></pre>';
    }
  };
  return { renderer };
}
