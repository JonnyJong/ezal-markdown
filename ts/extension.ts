import { IExtension } from "../types/dev";
import BLOCKQUOTE from './extensions/blockquote';
import CODE from './extensions/code'
import CODEBLOCK from './extensions/codeblock'
import DL from './extensions/dl'
import EMOJI from './extensions/emoji'
import ESCAPE from './extensions/escape'
import FOOTNOTE from './extensions/footnote'
import HEADING from './extensions/heading'
import HR from './extensions/hr'
import HTML from './extensions/html'
import IMAGE from './extensions/image'
import LINK from './extensions/link'
import LIST from './extensions/list'
import TABLE from './extensions/table'
import STYLED_TEXT from './extensions/styled-text'

type Extensions = {
  inline: {[name: string]: IExtension},
  block: {[name: string]: IExtension},
};

let extensions: Extensions = {
  inline: {},
  block: {},
};

export function registerExtensions(exts: IExtension[]): void {
  if (!Array.isArray(exts)) throw new Error('Require Extension[]');
  for (const extension of exts) {
    if (typeof extension.name !== 'string' || extension.name === '') {
      console.error("require Extension name.");
      continue;
    }
    if (typeof extension.level !== 'string' || !['inline', 'block'].includes(extension.level)) {
      console.error("require Extension level or illegal level.");
      continue;
    }
    if (typeof extension.start !== 'function') {
      console.error("require Extension start function.");
      continue;
    }
    if (typeof extension.match !== 'function') {
      console.error("require Extension match function.");
      continue;
    }
    if (typeof extension.render !== 'function') {
      console.error("require Extension render function.");
      continue;
    }
    extensions[extension.level][extension.name] = extension;
  }
}
export function getAllBlockExtensions(): IExtension[] {
  let exts: IExtension[] = [];
  for (const name in extensions.block) {
    exts.push(extensions.block[name]);
  }
  return exts;
}
export function getAllInlineExtensions(): IExtension[] {
  let exts: IExtension[] = [];
  for (const name in extensions.inline) {
    exts.push(extensions.inline[name]);
  }
  return exts;
}

export function loadInternalExtensions() {
  registerExtensions(BLOCKQUOTE);
  registerExtensions(CODE);
  registerExtensions(CODEBLOCK);
  registerExtensions(DL);
  registerExtensions(EMOJI);
  registerExtensions(ESCAPE);
  registerExtensions(FOOTNOTE);
  registerExtensions(HEADING);
  registerExtensions(HR);
  registerExtensions(HTML);
  registerExtensions(IMAGE);
  registerExtensions(LINK);
  registerExtensions(LIST);
  registerExtensions(TABLE);
  registerExtensions(STYLED_TEXT);
}