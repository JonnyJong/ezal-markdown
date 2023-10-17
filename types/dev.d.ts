// Type definitions for Ezal Markdown 1.0.0
// Project: https://github.com/JonnyJong/ezal-markdown
// Definitions by: Jonny <https://github.com/JonnyJong>
// Definitions: https://github.com/JonnyJong/ezal-markdown

export type IEmpty = null | undefined | void;
export type IAsyncReturnValue<T> = T | Promise<T>;

/**
 * 渲染相关变量
 */
export type IVariables = {
  /**
   * 渲染选项
   * 用户设定，渲染扩展不可更变
   * @readonly
   */
  options: {
    code_highlight?: (src: string, language?: string)=>IAsyncReturnValue<{content: string, language: string}>,
    footnote_class?: string,
    heading_author_prefix?: string,
    todo_list_class?: string,
    [x: string | number | symbol]: any,
  },
  /**
   * 目录
   */
  toc: IToc,
  /**
   * 其他由扩展自定义的变量
   */
  [x: string | number | symbol]: any;
};
/**
 * 匹配结果
 */
export type IMatched = {
  /**
   * 原始的匹配结果
   * 渲染器会根据此匹配结果对源文本进行裁剪等操作
   */
  raw: string,
  /**
   * 除去格式的文本
   * 由扩展自行操作
   */
  text: string,
  /**
   * 参数列表
   */
  args?: string[],
  /**
   * 参数
   */
  arg?: string,
  /**
   * 其他数据
   */
  [x: string | number | symbol]: any;
};
/**
 * Markdown 渲染扩展
 */
export type IExtension<> = {
  /**
   * 扩展名
   * 存在名称相同的已注册扩展时，旧扩展会覆盖新扩展
   */
  name: string,
  /**
   * 级别
   * block：块状
   * inline：行内
   */
  level: 'block' | 'inline',
  /**
   * 匹配起始位置
   * @param src 源文本
   * @param variables 渲染时可能需要使用的变量
   * @returns 返回匹配的起始下标，返回 Empty 类型或 -1 代表没有匹配到结果
   */
  start(src: string, variables: IVariables): IAsyncReturnValue<number | IEmpty>;
  /**
   * 匹配文本
   * @param src 源文本
   * @param variables 渲染时可能需要使用的变量
   * @returns 返回匹配的结果，返回 Empty 类型代表匹配失败
   */
  match(src: string, variables: IVariables): IAsyncReturnValue<IMatched | IEmpty>;
  /**
   * 渲染匹配的结果
   * @param src 源文本
   * @param variables 渲染时可能需要使用的变量
   * @returns 返回 HTML 格式的字符串
   */
  render(matched: IMatched, variables: IVariables): IAsyncReturnValue<String>;
  /**
   * 优先级
   * 当匹配的起始位置相同时，由优先级高的渲染
   */
  priority?: number,
};
/**
 * 扁平目录项
 */
export type IFlatToc = {
  /**
   * 名称
   */
  name: string,
  /**
   * 锚
   */
  id: string,
  /**
   * 级别
   */
  level: number,
};
/**
 * 树状目录项
 */
export type ITreeToc = {
  /**
   * 名称
   */
  name: string,
  /**
   * 锚
   */
  id: string,
  /**
   * 子项
   */
  child: ITreeToc[],
};
/**
 * 普通目录对象
 */
export type INormalToc = {
  flat: IFlatToc[],
  tree: ITreeToc[],
};
/**
 * 注册扩展
 * @param extensions 扩展数组
 */
export function IRegisterExtensions(extensions: IExtension[]): void;
/**
 * 渲染 Markdown 文本
 * 主要用于渲染一行的 Markdown 文本，仅行内拓展生效
 * @param src Markdown 源文本
 * @param variables 渲染时可能需要使用的变量
 */
export function IRenderLine(src: string, variables?: IVariables): Promise<{content: string, variables: IVariables}>;
/**
 * 渲染 Markdown 文本
 * 主要用于渲染整段和块状的 Markdown 文本，所以拓展都会生效
 * @param src Markdown 源文本
 * @param variables 渲染时可能需要使用的变量
 */
export function IRender(src: string, variables?: IVariables): Promise<{content: string, variables: IVariables, toc: INormalToc}>;
/**
 * 目录类
 * 用于创建目录并记录 id，防止 id 冲突
 */
export interface IToc {
  /**
   * 注册一个目录项
   * @param name 名称
   * @param id 强制使用 id
   * @returns id
   */
  addTocItem(name: string, level: number, id?: string): string;
  /**
   * 注册一个 id
   * @param id 目标 id
   * @returns 最终 id
   */
  addId(id: string): string;
  /**
   * 转换为普通 toc 对象
   */
  toNormal(): INormalToc;
}
