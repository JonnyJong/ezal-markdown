import { IExtension, IMatched, IVariables } from "../../types/dev";

function getCustomId(text: string) {
  let id = text.match(/(?<= ){#([A-Za-z0-9|_|\-]+)}/)?.[1];
  if (id) {
    return{
      text: text.slice(0, text.length - 4 - id.length),
      customId: id,
    };
  }
  return{
    text,
  };
}

function renderHeading(matched: IMatched, variables: IVariables): string {
  let anchor = variables.toc.addTocItem(matched.text, matched.level, matched.customId);
  return`<h${matched.level}${variables.options.heading_author_prefix ? ' class="' + variables.options.heading_author_prefix + '"' : ''} id="${anchor}">${matched.text}</h${matched.level}>`;
}

const heading: IExtension = {
  name: 'heading',
  priority: 0,
  level: 'block',
  start(src, variables) {
    return src.match(/(^|(?<=\n))#{1,6} (.*)/)?.index;
  },
  match(src, variables) {
    let raw = src.match(/(^|(?<=\n))#{1,6} (.*)/)?.[0];
    if (!raw) return;
    let level = (src.match(/#{1,6}/) as string[])[0].length;
    let textOrigin = raw.slice(level)
    if (textOrigin.match(new RegExp('#{' + level + '}$'))) {
      textOrigin = textOrigin.slice(0, textOrigin.length - level);
    }
    textOrigin = textOrigin.trim();
    let {text, customId} = getCustomId(textOrigin);
    return{
      raw,
      text,
      level,
      customId,
    };
  },
  render(matched, variables) {
    return renderHeading(matched, variables);
  },
};

const headingUnderscore: IExtension = {
  name: 'heading-underscore',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))(\S+)\n([\-]{3,}|[\=]{3,})/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/(^|(?<=\n))(\S+)\n([\-]{3,}|[\=]{3,})/);
    if (!matched) return;
    if (matched[2].match(/\-*/)?.[0].length === matched[2].length) return;
    let {customId, text} = getCustomId(matched[2]);
    return{
      raw: matched[0],
      text: text.trim(),
      customId,
      level: (matched[3].indexOf('=') === 0) ? 1 : 2,
    };
  },
  render(matched, variables) {
    return renderHeading(matched, variables);
  },
};

export default [heading, headingUnderscore];