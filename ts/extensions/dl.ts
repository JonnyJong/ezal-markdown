import { IExtension } from "../../types/dev";
import { render, renderLine } from "../renderer";

const dl: IExtension = {
  name: 'dl',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))(.*)(\n: (.*))+(\n(.*)(\n: (.*))+)*/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/(^|(?<=\n))(.*)(\n: (.*))+(\n(.*)(\n: (.*))+)*/);
    if (!matched) return;
    let raw = matched[0];
    let items: any = [];
    let item = {head:'',body:''};
    raw.split('\n').forEach((line)=>{
      if (line.indexOf(': ') === 0) {
        item.body += line.slice(2) + '\n';
      }else{
        item = {head:line,body:''};
        items.push(item);
      }
    });
    return{
      raw,
      text: '',
      items,
    };
  },
  async render(matched, variables) {
    let html = '';
    for (const item of matched.items) {
      html += `<dt>${(await renderLine(item.head, variables)).content}</dt><dd>${(await render(item.body, variables, false)).content}</dd>`;
    }
    return`<dl>${html}</dl>`;
  },
};
export default [dl];