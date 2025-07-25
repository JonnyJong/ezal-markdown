import { Plugin, PluginsManager } from './plugin';
import { Logger, RenderOptions, RenderResult, render } from './render';
import { NodeType } from './token';

export type {
	TokenizeOptions,
	NodeType,
	BaseNodeInit,
	AtomicNodeInit,
	InlineNodeInit,
	BlockNodeInit,
	Node,
	TypeToNode,
} from './token';
export type {
	Plugin,
	ParseChildren,
	BaseParseResult,
	AtomicParseResult,
	InlineParseResult,
	BlockParseResult,
	TypeToParseResult,
	ParseChildrenToRenderChildren,
	ParseResultToRenderSource,
	PluginLogger,
} from './plugin';
export type { CodeParsed, CodeblockParsed } from './plugins/code';
export type { ImageParsed, ImageRefParsed } from './plugins/image';
export type { ListParsed, TaskListParsed } from './plugins/list';
export type { TableParsed } from './plugins/table';
export type { TexParsed, TexOptions } from './plugins/tex';
export type { Slugifier } from './anchor';
export type {
	RenderContext,
	MarkdownFormatOptions,
	RenderContextOptions,
	RenderOptions,
	RenderResult,
	LogInfo,
	Logger,
} from './render';

export * from './frontmatter';
export {
	BaseNode,
	AtomicNode,
	InlineNode,
	BlockNode,
	NODE_TYPES,
} from './token';
export {
	md,
	ParseChild,
} from './plugin';
export { plugins } from './plugins';
export * from './anchor';
export * from './toc';
export * from './counter';
export * as utils from './utils';

const globalPlugins = new PluginsManager();

export class EzalMarkdown {
	#plugins = new PluginsManager();
	logger?: Logger;
	/**
	 * 设置插件
	 * @returns 是否存在插件覆盖
	 */
	set(...plugins: Plugin<NodeType>[]): boolean {
		return this.#plugins.set(...plugins);
	}
	/**
	 * 移除插件
	 * @param type 插件类型
	 * @param name 插件名称
	 * @returns 插件是否被移除
	 */
	rm(name: NodeType, type: string): boolean;
	/**
	 * 移除插件
	 * @returns 是否有插件被移除
	 */
	rm(...plugins: Plugin<NodeType>[]): boolean;
	rm(
		arg0: NodeType | Plugin<NodeType>,
		arg1?: string | Plugin<NodeType>,
		...plugins: Plugin<NodeType>[]
	): boolean {
		return this.#plugins.rm(arg0 as any, arg1 as any, ...plugins);
	}
	/** 渲染 Markdown 文本 */
	render(source: string, options?: RenderOptions): Promise<RenderResult> {
		return render(source, globalPlugins.getPluginsMap(this.#plugins), {
			...options,
			context: {
				logger: this.logger ?? EzalMarkdown.logger,
				...options?.context,
			},
		});
	}
	static logger: Logger = console;
	/**
	 * 设置插件
	 * @returns 是否存在插件覆盖
	 */
	static set(...plugins: Plugin<NodeType>[]): boolean {
		return globalPlugins.set(...plugins);
	}
	/**
	 * 移除插件
	 * @param type 插件类型
	 * @param name 插件名称
	 * @returns 插件是否被移除
	 */
	static rm(name: NodeType, type: string): boolean;
	/**
	 * 移除插件
	 * @returns 是否有插件被移除
	 */
	static rm(...plugins: Plugin<NodeType>[]): boolean;
	static rm(
		arg0: NodeType | Plugin<NodeType>,
		arg1?: string | Plugin<NodeType>,
		...plugins: Plugin<NodeType>[]
	): boolean {
		return globalPlugins.rm(arg0 as any, arg1 as any, ...plugins);
	}
	/** 渲染 Markdown 文本 */
	static render(source: string, options?: RenderOptions): Promise<RenderResult> {
		return render(source, globalPlugins.getPluginsMap(), {
			...options,
			context: {
				logger: EzalMarkdown.logger,
				...options?.context,
			},
		});
	}
}
