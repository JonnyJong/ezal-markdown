import { IExtension, IVariables } from "../../types/dev";
import { render } from "../renderer";

const footnote: IExtension = {
  name: 'footnote',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(/\[\^(.*?)\]/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/\[\^(.*?)\]/);
    if (!matched) return;
    return{
      raw: matched[0],
      text: matched[1],
    };
  },
  render(matched, variables) {
    return`<a${variables.options.footnote_class ? ' class="' + variables.options.footnote_class + '"' : ''} href="#${variables.footnote[matched.text]}">${matched.text}</a>`;
  },
};
function getFootnoteUrl(id: string, v: IVariables) {
  let url = v.toc.addId(id);
  if (!v.footnote) {
    v.footnote = {};
  }
  if (v.footnote[id]) {
    console.warn(`Same footnote id "${id}"`);
  }
  v.footnote[id] = url;
  return url;
}
const footnoteSource: IExtension = {
  name: 'footnote-source',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))\[\^(.*)\]\: (.*)(\n(  |\t)(.*))*(\n\[\^(.*)\]\: (.*)(\n(  |\t)(.*))*)*/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/(^|(?<=\n))\[\^(.*)\]\: (.*)(\n(  |\t)(.*))*(\n\[\^(.*)\]\: (.*)(\n(  |\t)(.*))*)*/)?.[0];
    if (!raw) return;
    let items = [];
    let item = {text: '', id: '', url: ''};
    for (const line of raw.split('\n')) {
      let lineMatched = line.match(/^\[\^(.*)\]: (.*)/);
      if (lineMatched) {
        item = {text: lineMatched[2], id: lineMatched[1], url: getFootnoteUrl(lineMatched[1], variables)};
        items.push(item);
        continue;
      }
      item.text += '\n' + line;
    }
    return{
      raw,
      text: '',
      items,
    };
  },
  async render(matched, variables) {
    let html = '';
    for (const item of matched.items) {
      html += `<dt id="${item.url}">${item.id}</dt><dd>${(await render(item.text, variables, false)).content}</dd>`;
    }
    return`<dl>${html}</dl>`;
  },
};
export default [footnote, footnoteSource];