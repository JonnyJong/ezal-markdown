import { IExtension } from "../../types/dev";

import emojiLib from "./emoji.json";
const emoji: IExtension = {
  name: 'emoji',
  level: 'inline',
  priority: 0,
  start(src, variables) {
    return src.match(/:([\+\-\d_a-z]+):/)?.index;
  },
  match(src, variables) {
    let matched = src.match(/:([\+\-\d_a-z]+):/);
    if (!matched || !(matched[1] in emojiLib)) return;
    return{
      raw: matched[0],
      text: (emojiLib as {[x:string]:string})[matched[1]],
    };
  },
  render(matched, variables) {
    return matched.text;
  },
};
export default [emoji];