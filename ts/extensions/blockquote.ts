import { IExtension } from "../../types/dev";
import { render } from "../renderer";

const blockquote: IExtension = {
  name: 'blockquote',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))\>(.+)(\n>(.+))*/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/(^|(?<=\n))\>(.+)(\n>(.+))*/)?.[0];
    if (!raw) return;
    let text = '';
    raw.split('\n>').forEach((line)=>{
      if (line.indexOf(' >') === 0) {
        text += '\n' + line.slice(1);
      }else{
        text += '\n' + line;
      }
    });
    text = text.slice(3);
    return{
      raw,
      text,
    };
  },
  async render(matched, variables) {
    return `<blockquote>${(await render(matched.text, variables, false)).content}</blockquote>`;
  },
};
export default [blockquote];