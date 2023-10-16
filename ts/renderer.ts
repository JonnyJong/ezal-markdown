import { IVariables } from "../types/dev";
import { Toc } from "./toc";
import { walkBlocks, walkLine } from "./tokenizer";

export function createVariables(options: any = {}): IVariables {
  return {
    options: options,
    toc: new Toc(),
  };
}

export async function renderLine(source: string, iVar: IVariables = createVariables()): Promise<{content: string, variables: IVariables}> {
  source = source.replace(/\r/g, '');

  let matcheds = await walkLine(source, iVar);

  if (matcheds.length === 0) {
    return {
      content: source,
      variables: iVar,
    };
  }

  let content = '';
  let offset = 0;
  for (let i = 0; i < matcheds.length; i++) {
    if (!matcheds[i]) continue;

    content += source.slice(offset, i);
    content += await matcheds[i].ext.render(matcheds[i].matched, iVar);

    i += matcheds[i].matched.raw.length;
    offset = i;
  }
  content += source.slice(offset);
  
  return { content, variables: iVar };
}

async function renderLines(source: string, iVar: IVariables, para: boolean = true): Promise<string> {
  let lines = source.split('\n');

  let content = '';
  let inPara = false;
  for (const line of lines) {
    if (line === '') {
      if (inPara) {
        inPara = false;
        if (para) content += '</p>';;
      };
      continue;
    }

    if (!inPara) {
      inPara = true;
      if (para) content += '<p>';
    } else {
      content += '<br>';
    }

    content += (await renderLine(line, iVar)).content;
  }
  if (inPara && para) content += '</p>';
  return content;
}

export async function render(source: string, iVar: IVariables = createVariables(), para: boolean = true): Promise<{content: string, variables: IVariables}> {
  source = source.replace(/\r/g, '');
  
  let matcheds = await walkBlocks(source, iVar);

  if (matcheds.length === 0) {
    return {
      content: await renderLines(source, iVar, para),
      variables: iVar,
    };
  }

  let content = '';
  let offset = 0;
  for (let i = 0; i < matcheds.length; i++) {
    if (!matcheds[i]) continue;

    content += await renderLines(source.slice(offset, i), iVar, para);
    content += await matcheds[i].ext.render(matcheds[i].matched, iVar);

    i += matcheds[i].matched.raw.length;
    offset = i;
  }
  content += await renderLines(source.slice(offset), iVar, para);

  return { content, variables: iVar };
}