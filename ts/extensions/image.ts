import { IExtension } from "../../types/dev";

const image: IExtension = {
  name: 'image',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(/!\[(.*)\]\((.*)\)/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/!\[(.*)\]\((.*)\)/);
    if (!matched) return;
    let body = matched[2].split(' ');
    let link = body[0];
    let title = body.slice(1).join(' ');
    if (title && (/^"(.*)"$/.test(title) || /^'(.*)'$/.test(title))) {
      title = title.slice(1, title.length - 1).replace(/\"/g, '&quot');
    }
    return{
      raw: matched[0],
      text: matched[1],
      link,
      title,
    };
  },
  render(matched, variables) {
    return`<img src="${matched.link}" alt="${matched.text}"${matched.title ? ' title="' + matched.title + '"' : ''}>`;
  },
};
export default [image];