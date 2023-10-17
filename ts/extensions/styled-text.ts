import { IExtension } from "../../types/dev";
import { renderLine } from "../renderer";

const rule = {
  bold: /\*\*(.*)\*\*/,
  italic: /\*(.*)\*/,
  boldAndItalic: /\*\*\*(.*)\*\*\*/,
  underscore: /__(.*)__/,
  del: /~~(.*)~~/,
};

const bold: IExtension = {
  name: 'bold',
  priority: 0,
  level: 'inline',
  start(src, variables) {
    return src.match(rule.bold)?.index;
  },
  match(src, variables) {
    let raw = src.match(rule.bold)?.[0];
    if (!raw) return;
    let text = raw.slice(2, raw.length - 2).trim();
    return{
      raw,
      text,
    };
  },
  async render(matched, variables) {
    return `<b>${(await renderLine(matched.text,  variables)).content}</b>`;
  },
};
const italic: IExtension = {
  name: 'italic',
  priority: 0,
  level: 'inline',
  start(src, variables) {
    return src.match(rule.italic)?.index;
  },
  match(src, variables) {
    let raw = src.match(rule.italic)?.[0];
    if (!raw) return;
    let text = raw.slice(1, raw.length - 1).trim();
    return{
      raw,
      text,
    };
  },
  async render(matched, variables) {
    return `<i>${(await renderLine(matched.text, variables)).content}</i>`;
  },
};
const boldAndItalic: IExtension = {
  name: 'bold-italic',
  priority: 1,
  level: 'inline',
  start(src, variables) {
    return src.match(rule.boldAndItalic)?.index;
  },
  match(src, variables) {
    let raw = src.match(rule.boldAndItalic)?.[0];
    if (!raw) return;
    let text = raw.slice(3, raw.length - 3).trim();
    return{
      raw,
      text,
    };
  },
  async render(matched, variables) {
    return `<i><b>${(await renderLine(matched.text, variables)).content}</b></i>`;
  },
};
const underscore: IExtension = {
  name: 'underscore',
  priority: 0,
  level: 'inline',
  start(src, variables) {
    return src.match(rule.underscore)?.index;
  },
  match(src, variables) {
    let raw = src.match(rule.underscore)?.[0];
    if (!raw) return;
    let text = raw.slice(2, raw.length - 2).trim();
    return{
      raw,
      text,
    };
  },
  async render(matched, variables) {
    return `<u>${(await renderLine(matched.text, variables)).content}</u>`;
  },
};
const del: IExtension = {
  name: 'del',
  priority: 0,
  level: 'inline',
  start(src, variables) {
    return src.match(rule.del)?.index;
  },
  match(src, variables) {
    let raw = src.match(rule.del)?.[0];
    if (!raw) return;
    let text = raw.slice(2, raw.length - 2).trim();
    return{
      raw,
      text,
    };
  },
  async render(matched, variables) {
    return `<del>${(await renderLine(matched.text, variables)).content}</del>`;
  },
};
export default [bold, italic, boldAndItalic, underscore, del];