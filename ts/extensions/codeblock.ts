import { IExtension } from "../../types/dev";

const codeblock: IExtension = {
  name: 'codeblock',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))(    |\t)(.*)(\n(    |\t)(.*))*/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/(^|(?<=\n))(    |\t)(.*)(\n(    |\t)(.*))*/)?.[0];
    if (!raw) return;
    let text = '';
    for (const line of raw.split('\n')) {
      text += '\n' + line.slice((line.match(/^(    |\t)/) as string[])[0].length);
    }
    return{
      raw,
      text: text.slice(1),
    };
  },
  render(matched, variables) {
    return`<pre><code>${typeof variables.options.code_highlight === 'function' ? variables.options.code_highlight(matched.text) : ''}</code></pre>`;
  },
};
const fenceCodeblock: IExtension = {
  name: 'fence-codeblock',
  level: 'block',
  priority: 1,
  start(src, variables) {
    return src.match(/(^|(?<=\n))(```|~~~)(.*)\n([\S\s]*?)\n(```|~~~)/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/(^|(?<=\n))(```|~~~)(.*)\n([\S\s]*?)\n(```|~~~)/);
    if (!matched) return;
    return{
      raw: matched[0],
      text: matched[4],
      arg: matched[3],
      args: matched[3].split(' '),
    };
  },
  async render(matched, variables) {
    let lang = (matched.args && matched.args[0]) ? matched.args[0] : undefined;
    let result: {content: string, language: string} = {
      content: matched.text,
      language: '',
    };
    if (typeof variables.options.code_highlight === 'function') {
      result = await variables.options.code_highlight(matched.text, lang);
    }
    return`<pre><code${result.language === '' ? '' : ' class="' + result.language + '"'}>${result.content}</pre>`;
  },
};
export default [codeblock, fenceCodeblock];