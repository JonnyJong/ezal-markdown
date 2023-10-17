import { IExtension } from "../../types/dev"

const rule = {
  markdown: /(\\\\|\\`|\\\*|\\_|\\\{|\\\}|\\\[|\\\]|\\\(|\\\)|\\#|\\\+|\\\-|\\\.|\\\!|\\\||\\\<|\\>|\\&){1}/,
  html: /(\\\<|\\>|\\&){1}/,
}
const escapeMarkdown: IExtension = {
  name: 'escape',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(rule.markdown)?.index;
  },
  match(src, variables) {
    let raw = src.match(rule.markdown)?.[0];
    if (!raw) return;
    return{
      raw,
      text: raw.slice(1),
    };
  },
  render(matched, variables) {
    return matched.text;
  },
};
export default [escapeMarkdown];