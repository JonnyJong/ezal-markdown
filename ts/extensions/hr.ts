import { IExtension } from "../../types/dev";

const hr: IExtension = {
  name: 'hr',
  level: 'block',
  priority: 0,
  start(src, variables) {
    let a = src.match(/(^|(?<=\n))[\*\-_]{3,}\s/)?.index;
    if (typeof a === 'number') return a;
    return src.match(/(^|(?<=\n))[\*\-_]{3,}$/)?.index;
  },
  match(src, variables) {
    let a = src.match(/(^|(?<=\n))[\*\-_]{3,}\s/)?.[0];
    let raw = a;
    if (!a) {
      raw = src.match(/(^|(?<=\n))[\*\-_]{3,}$/)?.[0];
    }
    if (!raw) return;
    return{
      raw,
      text: '',
    };
  },
  render(matched, variables) {
    return'<hr>';
  },
};

export default [hr];