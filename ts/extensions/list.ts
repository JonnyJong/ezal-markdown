import { IExtension } from "../../types/dev";
import { render } from "../renderer";

const ol: IExtension = {
  name: 'ol',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))1\. (.*)/)?.index;
  },
  match(src, variables) {
    let lines = src.split('\n');
    let end = 1;
    for (const line of lines) {
      if (!line.match(/(\d\. |  |\t)/)) break;
      end++;
    }
    let rawLines = lines.slice(0, end);
    let raw = rawLines.join('\n');
    let text = '';
    let args: string[] = [];
    let i = -1;
    for (const line of rawLines) {
      text += line.slice(2).trim();
    }
    for (const line of rawLines) {
      if (line.match(/\d\. /)?.index === 0) {
        i++;
        args.push(line.slice(2).trim() + '\n');
        text += line.slice(2).trim() + '\n';
        continue;
      }
      text += line.trim() + '\n';
      args[i] += line.trim() + '\n';
    }
    return{
      raw,
      text,
      args,
    };
  },
  async render(matched, variables) {
    let html = '';
    for (const arg of (matched.args as unknown as string[])) {
      html += `<li>${(await render(arg, variables, false)).content}</li>`;
    }
    return `<ol>${html}</ol>`;
  },
};
const ul: IExtension = {
  name: 'ul',
  level: 'block',
  priority: 0,
  start(src, variables) {
    return src.match(/(^|(?<=\n))[\-\*\+]{1} (.*)/)?.index;
  },
  match(src, variables) {
    let lines = src.split('\n');
    let end = 1;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].match(/(\-|\*|\+|  |\t)/)) break;
      end++;
    }
    let rawLines = lines.slice(0, end);
    let raw = rawLines.join('\n');
    let text = '';
    let args: string[] = [];
    let i = -1;
    for (const line of rawLines) {
      text += line.slice(2).trim();
    }
    for (const line of rawLines) {
      if (line.match(/\-|\*|\+/)?.index === 0) {
        i++;
        args.push(line.slice(2).trim() + '\n');
        text += line.slice(2).trim() + '\n';
        continue;
      }
      text += line.trim() + '\n';
      args[i] += line.trim() + '\n';
    }
    return{
      raw,
      text,
      args,
    };
  },
  async render(matched, variables) {
    let html = '';
    for (const arg of (matched.args as unknown as string[])) {
      let matched = arg.match(/^\[(\S|\s)\] (.*)/);
      if (matched) {
        html += `<li${variables.options.todo_list_class ? ` class="${variables.options.todo_list_class}"` : ''}><input type="checkbox"${matched[1] !== ' ' ? ' checked' : ''} disabled>${(await render(matched[2], variables, false)).content}</li>`;
        continue;
      }
      html += `<li>${(await render(arg, variables, false)).content}</li>`;
    }
    return `<ul>${html}</ul>`;
  },
};
export default [ol, ul];