import { IExtension, IMatched, IVariables } from "../types/dev";
import { getAllBlockExtensions, getAllInlineExtensions } from "./extension";

type Matched = {
  ext: IExtension,
  matched: IMatched
};

type MatchedList = Matched[];

export async function walkBlocks(source: string, iVar: IVariables): Promise<MatchedList> {
  let matcheds: MatchedList = [];
  let exts = getAllBlockExtensions();
  for (const ext of exts) {
    let str = source;
    let offset = 0;
    while (true) {
      let index = await ext.start(str, iVar);
      if (typeof index !== 'number' || index < 0) break;
      let matched = await ext.match(str.slice(index), iVar);
      if (!matched || matched.raw.length < 1) {
        let next = str.indexOf('\n', index) + 1;
        str = str.slice(next);
        offset += next;
        continue;
      }
      if (matcheds[index + offset]) {
        let prev = matcheds[index + offset]?.ext.priority;
        let now = ext.priority;
        if (typeof now === 'number' && (typeof prev !== 'number' || now > prev)) {
          matched[index + offset] = {
            ext,
            matched,
          };
        }
      } else {
        matcheds[index + offset] = {
          ext,
          matched,
        };
      }
      let next = index + matched.raw.length;
      str = str.slice(next);
      offset += next;
      if (!str.match(/\S/)) break;
    }
  }
  let finalMatcheds: MatchedList = [];
  for (let i = 0; i < matcheds.length; i++) {
    if (!matcheds[i]) continue;
    finalMatcheds[i] = matcheds[i];
    i += matcheds[i].matched.raw.length;
  }
  return finalMatcheds;
}
export async function walkLine(source: string, iVar: IVariables): Promise<MatchedList> {
  let matcheds: MatchedList = [];
  let exts = getAllInlineExtensions();
  for (const ext of exts) {
    let str = source;
    let offset = 0;
    while (true) {
      let index = await ext.start(str, iVar);
      if (typeof index !== 'number' || index < 0) break;
      let matched = await ext.match(str.slice(index), iVar);
      if (!matched || matched.raw.length < 1) {
        let next = index + 1;
        str = str.slice(next);
        offset += next;
        continue;
      }
      if (matcheds[index + offset]) {
        let prev = matcheds[index + offset].ext.priority;
        let now = ext.priority;
        if (typeof now === 'number' && (typeof prev !== 'number' || now > prev)) {
          matcheds[index + offset] = {
            ext,
            matched,
          };
        }
      } else {
        matcheds[index + offset] = {
          ext,
          matched,
        };
      }
      let next = index + matched.raw.length;
      str = str.slice(next);
      offset += next;
      if (!str.match(/\S/)) break;
    }
  }
  let finalMatcheds: MatchedList = [];
  for (let i = 0; i < matcheds.length; i++) {
    if (!matcheds[i]) continue;
    finalMatcheds[i] = matcheds[i];
    i += matcheds[i].matched.raw.length;
  }
  return finalMatcheds;
}