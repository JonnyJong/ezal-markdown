import { IExtension } from '../../types/dev';

const RULE = /\\./;

const HTML_ESCAPE_MAP: { [k: string]: string } = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
};

const escapeMarkdown: IExtension = {
  name: 'escape',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(RULE)?.index;
  },
  match(src, variables) {
    let raw = src.match(RULE)?.[0];
    if (!raw) return;
    return {
      raw,
      text: raw.slice(1),
    };
  },
  render(matched, variables) {
    if (matched.text in HTML_ESCAPE_MAP) {
      return HTML_ESCAPE_MAP[matched.text];
    }
    return matched.text;
  },
};
export default [escapeMarkdown];
