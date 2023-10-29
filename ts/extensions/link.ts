import { IExtension, IVariables } from "../../types/dev";
import { renderLine } from "../renderer";

const pointedBracketLink: IExtension = {
  name: 'pointed-bracket-link',
  level: 'inline',
  priority: 1,
  start(src, variables) {
    return src.match(/\<[<[a-zA-z]+:\/\/[\S]*|]\>/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/\<[<[a-zA-z]+:\/\/[\S]*|]\>/)?.[0];
    if (!raw) return;
    return{
      raw,
      text: raw.slice(1, raw.length - 1),
    };
  },
  render(matched, variables) {
    return`<a href="${matched.text}">${matched.text}</a>`;
  },
};
const pointedBracketEmail: IExtension = {
  name: 'pointed-bracket-email',
  level: 'inline',
  priority: 1,
  start(src, variables) {
    return src.match(/\<[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?\>/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/\<[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?\>/)?.[0];
    if (!raw) return;
    return{
      raw,
      text: raw.slice(1, raw.length - 1),
    };
  },
  render(matched, variables) {
    return`<a href="mailto:${matched.text}">${matched.text}</a>`;
  },
};
const link: IExtension = {
  name: 'link',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(/\[(.+?)\]\((.+?)\)/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/\[(.+?)\]\((.+?)\)/);
    if (!matched) return;
    let body = matched[2].split(' ');
    let link = body[0];
    let title = body.slice(1).join(' ');
    if (title && (/^"(.*)"$/.test(title) || /^'(.*)'$/.test(title))) {
      title = title.slice(1, title.length - 1);
    }
    return{
      raw: matched[0],
      text: matched[1],
      link,
      title,
    };
  },
  async render(matched, variables) {
    return`<a href="${matched.link}"${matched.title ? ' title="' + matched.title + '"' : ''}>${(await renderLine(matched.text)).content}</a>`;
  },
};
const quoteLink: IExtension = {
  name: 'quote-link',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(/\[(.*)\][ ]?\[(.*)\]/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/\[(.*)\][ ]?\[(.*)\]/);
    if (!matched) return;
    if (matched[2].indexOf('^') === 0) return;
    return{
      raw: matched[0],
      text: matched[1],
      arg: matched[2],
    };
  },
  async render(matched, variables) {
    let link = variables.quoteLink[matched.arg as unknown as number];
    if (!link) {
      console.warn(`Can not found quote link "${matched.arg}"`);
    }
    return`<a href="${link}">${(await renderLine(matched.text)).content}</a>`;
  },
};
function parseQuoteLinkSource(src: string, v: IVariables) {
  let matched = src.match(/\[(.*)\]\:(.*)/);
  let body = (matched as string[])[2].trim().split(' ');
  let id = (matched as string[])[1];
  let link = body[0];
  let title = body.slice(1).join(' ');
  if (link.indexOf('<') === 0 && link.lastIndexOf('>') === link.length - 1) {
    link = link.slice(1, link.length - 1);
  }
  if (title) {
    if (/^"(.*)"$/.test(title) || /^'(.*)'$/.test(title) || /\((.*)\)$/.test(title)) {
      title = title.slice(1, title.length - 1);
    }
  }
  if (!v.quoteLink) {
    v.quoteLink = {};
  }
  if (id in v.quoteLink) {
    console.warn(`Same qoute link id "${id}".`)
  }
  v.quoteLink[id] = link;
  return[id, link, title];
}
const quoteLinkSource: IExtension = {
  name: 'quote-link-source',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))\[(.*)\]\:(.*)(\n\[(.*)\]\:(.*))*/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/(^|(?<=\n))\[(.*)\]\:(.*)(\n\[(.*)\]\:(.*))*/);
    if (!matched) return;
    let lines = matched[0].split('\n');
    let rawLines = [];
    let items = [];
    for (const line of lines) {
      if (line.indexOf('[^') === 0) break;
      rawLines.push(line);
      items.push(parseQuoteLinkSource(line, variables));
    }
    if (rawLines.length === 0) return;
    return{
      raw: rawLines.join('\n'),
      text: '',
      items,
    };
  },
  render(matched, variables) {
    let html = '';
    for (const item of matched.items) {
      html += `<dt>${item[2] ? item[2] : item[0]}</dt><dd><a href="${item[1]}">${item[1]}</a></dd>`;
    }
    return`<dl>${html}</dl>`;
  },
};

export default [
  pointedBracketLink,
  pointedBracketEmail,
  link,
  quoteLink,
  quoteLinkSource,
];