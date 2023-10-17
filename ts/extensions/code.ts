import { IExtension } from "../../types/dev";

const code: IExtension = {
  name: 'code',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(/`[^`](.*?)`/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/`[^`](.*?)`/)?.[0];
    if (!raw) return;
    let text = raw.slice(1, raw.length - 1);
    return{
      raw,
      text,
    };
  },
  render(matched, variables) {
    return `<code>${matched.text}</code>`;
  },
};
const doubleCode: IExtension = {
  name: 'code-double',
  level: 'inline',
  priority: 1,
  start(src, variables) {
    return src.match(/``[^`](.*?)``/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/``[^`](.*?)``/)?.[0];
    if (!raw) return;
    let text = raw.slice(2, raw.length - 2);
    return{
      raw,
      text,
    };
  },
  render(matched, variables) {
    return `<code>${matched.text}</code>`;
  },
};
export default [code, doubleCode];