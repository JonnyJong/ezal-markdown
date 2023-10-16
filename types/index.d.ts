// Type definitions for Ezal Markdown 1.0.0
// Project: https://github.com/JonnyJong/ezal-markdown
// Definitions by: Jonny <https://github.com/JonnyJong>
// Definitions: https://github.com/JonnyJong/ezal-markdown

type Empty = null | undefined | void;
type AsyncReturnValue<T> = T | Promise<T>;

import { IExtension, IFlatToc, IMatched, INormalToc, IToc, ITreeToc, IVariables } from "./dev";

declare module 'ezal-markdown'{
  /**
   * 渲染相关变量
   */
  export type Variables = IVariables;
  /**
   * 匹配结果
   */
  export type Matched = IMatched;
  /**
   * Markdown 渲染扩展
   */
  export type Extension = IExtension;
  /**
   * 扁平目录项
   */
  export type FlatToc = IFlatToc;
  /**
   * 树状目录项
   */
  export type TreeToc = ITreeToc;
  /**
   * 普通目录对象
   */
  export type NormalToc = INormalToc;
  /**
   * 目录类
   * 用于创建目录并记录 id，防止 id 冲突
   */
  export interface Toc extends IToc {}
  /**
   * 注册扩展
   * @param extensions 扩展数组
   */
  export function registerExtensions(extensions: Extension[]): void;
  /**
   * 渲染 Markdown 文本
   * 主要用于渲染一行的 Markdown 文本，仅行内拓展生效
   * @param src Markdown 源文本
   * @param variables 渲染时可能需要使用的变量
   */
  export function renderLine(src: string, options: any): Promise<{content: string, variables: Variables}>;
  /**
   * 渲染 Markdown 文本
   * 主要用于渲染整段和块状的 Markdown 文本，所以拓展都会生效
   * @param src Markdown 源文本
   * @param variables 渲染时可能需要使用的变量
   */
  export function render(src: string, options: any): Promise<{content: string, variables: Variables, toc: NormalToc}>;
  export const origin: {
    render(src: string, variables?: IVariables): Promise<{content: string, variables: IVariables, toc: INormalToc}>,
    renderLine(src: string, variables?: IVariables): Promise<{content: string, variables: IVariables}>,
  }
}
