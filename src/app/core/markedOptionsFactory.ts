import { MarkedRenderer, MarkedOptions } from 'ngx-markdown';
import * as marked from 'marked';

const codeLabel = {
  ts: 'TypeScript',
  js: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  bash: 'ターミナル'
};

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;'
};

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  renderer.paragraph = (text) => {
    const newText = text.replace(/\n/g, '<br>');
    if (newText.startsWith('<figure') && newText.endsWith('</figure>')) {
        return newText;
    } else {
        return '<p>' + newText + '</p>';
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
    return `<figure><img src="${href}">${caption}</figure>`;
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

    const info = lang.match(/note|denger|notice/);
    const dod = label.match(/dont|do/);

    if (info) {
      return `<div class="info info--${info[0]}">${marked(text, {renderer})}</div>`;
    } else if (dod) {
      return `<pre class="language-${lang} ${dod[0]}"><span class="lang">${dod[0].toUpperCase()}</span><code class="language-${lang}">` + text + '</code></pre>';
    } else if (lang) {
      if (/editorconfig|gitignore/.test(lang)) {
        lang = 'bash';
      }
      text = text.replace(/[&<>"'\/]/g, key => entityMap[key]);
      return `<pre class="language-${lang}"><span class="lang">${label}</span><code class="language-${lang}">` + text + '</code></pre>';
    } else {
      return `<pre class="no-lang"><code>` + text + '</code></pre>';
    }
  };
  return {renderer};
}
