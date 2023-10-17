import { IExtension } from "../../types/dev";

const html: IExtension = {
  name: 'html',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(/<(\S*?)[^>]*>.*?|<.*? \/>/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/<(\S*?)[^>]*>.*?|<.*? \/>/)?.[0];
    if (!raw) return;
    return{
      raw,
      text: raw,
    };
  },
  render(matched, variables) {
    return matched.text;
  },
};
export default [html];