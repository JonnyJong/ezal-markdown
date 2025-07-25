import { plugins } from './plugins';
import { RenderContext } from './render';
import { NODE_TYPES, NodeType, TokenizeOptions } from './token';
import { Children, MapChildren, mergeMap } from './utils';

//#region Plugin
type PromiseOr<T> = T | Promise<T>;

/**
 * 待处理的子内容
 * @description
 * 子内容的处理级别小于等于插件级别，
 * 若指定级别大于插件级别，则按照插件级别处理
 */
export class ParseChild {
	#content: string;
	#options: Partial<TokenizeOptions> = {};
	constructor(content: string, options?: Partial<TokenizeOptions>) {
		if (typeof content !== 'string') {
			throw new Error(
				`ParseChild constructor expects 'content' to be a string, but got ${typeof content}`,
			);
		}
		this.#content = content;
		if (!options || typeof options !== 'object') return;
		if (typeof options.maxLevel === 'string') {
			if (!NODE_TYPES.includes(options.maxLevel)) {
				throw new Error(
					`Invalid maxLevel: '${options.maxLevel}'. Expected one of: ${NODE_TYPES.join(', ')}`,
				);
			}
			this.#options.maxLevel = options.maxLevel;
		}
		if (typeof options.skipParagraphWrapping === 'boolean') {
			this.#options.skipParagraphWrapping = options.skipParagraphWrapping;
		}
		if (typeof options.lineBreak === 'string') {
			if (!['common-mark', 'soft'].includes(options.lineBreak)) {
				throw new Error(
					`Invalid lineBreak: '${options.lineBreak}'. Expected either 'common-mark' or 'soft'`,
				);
			}
			this.#options.lineBreak = options.lineBreak;
		}
	}
	/** 内容 */
	get content() {
		return this.#content;
	}
	/** 渲染参数 */
	get options() {
		return this.#options;
	}
}
/**
 * 构造待处理的子内容
 * @description
 * 子内容的处理级别小于等于插件级别，
 * 若指定级别大于插件级别，则按照插件级别处理
 */
export function md(content: string, options?: Partial<TokenizeOptions>) {
	return new ParseChild(content, options);
}
export type ParseChildren = Children<ParseChild>;

export interface BaseParseResult {
	/** 原始文本片段 */
	raw: string;
}

/** 原子类型匹配结果 */
export interface AtomicParseResult extends BaseParseResult {}

/** 行级类型匹配结果 */
export interface InlineParseResult extends BaseParseResult {
	/** 子内容 */
	children?: ParseChildren;
}

/** 块类型匹配结果 */
export interface BlockParseResult extends BaseParseResult {
	/** 子内容 */
	children?: ParseChildren;
}

export type TypeToParseResult<T extends NodeType> = T extends 'atomic'
	? AtomicParseResult
	: T extends 'inline'
		? InlineParseResult
		: T extends 'block'
			? BlockParseResult
			: never;

export type ParseChildrenToRenderChildren<T extends ParseChildren> =
	MapChildren<T, ParseChild, string>;

export type ParseResultToRenderSource<R> = R extends
	| InlineParseResult
	| BlockParseResult
	? Omit<R, 'children'> &
			(R['children'] extends ParseChildren
				? {
						children: R['children'] extends ParseChildren
							? ParseChildrenToRenderChildren<R['children']>
							: undefined;
					}
				: {})
	: R;

export interface PluginLogger {
	debug(message: string, errObj?: unknown): void;
	info(message: string, errObj?: unknown): void;
	warn(message: string, errObj?: unknown): void;
	error(message: string, errObj?: unknown): void;
}

/** 插件上下文类 */
export class PluginContext<
	C = never,
	P extends Plugin<NodeType, TypeToParseResult<NodeType>, C> = Plugin<
		NodeType,
		TypeToParseResult<NodeType>,
		C
	>,
> implements Omit<RenderContext, 'plugins' | 'pluginContexts' | 'logger'>
{
	#context: RenderContext;
	#plugin: P;
	#logger: PluginLogger;
	/** 插件内上下文 */
	self!: C;
	constructor(context: RenderContext, plugin: P) {
		this.#context = context;
		this.#plugin = plugin;
		this.#logger = Object.freeze({
			debug: (message, errObj) =>
				context.logger.debug({
					type: plugin.type,
					name: plugin.name,
					message,
					errObj,
				}),
			info: (message, errObj) =>
				context.logger.info({
					type: plugin.type,
					name: plugin.name,
					message,
					errObj,
				}),
			warn: (message, errObj) =>
				context.logger.warn({
					type: plugin.type,
					name: plugin.name,
					message,
					errObj,
				}),
			error: (message, errObj) =>
				context.logger.error({
					type: plugin.type,
					name: plugin.name,
					message,
					errObj,
				}),
		} satisfies PluginLogger);
	}
	async init(preset?: { context: unknown }) {
		if (preset) this.self = preset.context as C;
		else this.self = (await this.#plugin.context?.()) as C;
	}
	get shared() {
		return this.#context.shared;
	}
	get anchors() {
		return this.#context.anchors;
	}
	get toc() {
		return this.#context.toc;
	}
	get counter() {
		return this.#context.counter;
	}
	get plugin() {
		return this.#plugin;
	}
	get logger() {
		return this.#logger;
	}
}

/** 插件 */
export interface Plugin<
	T extends NodeType,
	R extends TypeToParseResult<T> = TypeToParseResult<T>,
	C = never,
> {
	/** 名称 */
	name: string;
	/**
	 * 节点类型
	 * @description
	 * - `block`：块节点
	 * - `inline`：行级节点
	 * - `atomic`：原子节点
	 */
	type: T;
	/**
	 * 优先级
	 * @default 0
	 */
	priority?: number;
	/**
	 * 匹配起始位置
	 * @description
	 * - `StartMatcher`：使用函数匹配，返回 `-1 | null | undefined` 表示未匹配
	 * - `string`：匹配字符串所在位置
	 * - `RegExp`：匹配正则表达式所在位置
	 */
	start:
		| string
		| RegExp
		| ((
				source: string,
				context: PluginContext<C>,
		  ) => PromiseOr<number | RegExpMatchArray | null | undefined>);
	/** 解析 */
	parse(
		source: string,
		context: PluginContext<C, this>,
	): PromiseOr<R | null | undefined | false>;
	/** 渲染 */
	render(
		source: ParseResultToRenderSource<R>,
		context: PluginContext<C, this>,
	): PromiseOr<string>;
	/** 初始化插件内上下文 */
	context?: C extends never ? undefined : () => PromiseOr<C>;
}

//#region Manager
export type PluginsMap = {
	[K in NodeType]: Map<string, Plugin<K>>;
};

export type PluginsContextData = { [K in NodeType]?: { [k: string]: unknown } };

export function compareContext(
	a: PluginContext<any>,
	b: PluginContext<any>,
): number {
	const pA = a.plugin.priority;
	const pB = b.plugin.priority;
	if (typeof pA === 'number' && typeof pB === 'number') return pB - pA;
	if (typeof pA === 'number') return -1;
	if (typeof pB === 'number') return 1;
	const nA = a.plugin.name;
	const nB = b.plugin.name;
	if (nA > nB) return -1;
	if (nA < nB) return 1;
	return 0;
}

export class PluginContextMap {
	#map: {
		[K in NodeType]: [
			Map<
				string,
				PluginContext<unknown, Plugin<K, TypeToParseResult<K>, unknown>>
			>,
			PluginContext<K>[],
		];
	} = {
		block: [new Map(), []],
		inline: [new Map(), []],
		atomic: [new Map(), []],
	};
	constructor(plugins: PluginsMap, context: RenderContext) {
		for (const type of NODE_TYPES) {
			for (const [name, plugin] of plugins[type]) {
				this.#map[type][0].set(name, new PluginContext(context, plugin) as any);
			}
		}
	}
	async init(data?: PluginsContextData) {
		for (const type of NODE_TYPES) {
			for (const [name, context] of this.#map[type][0]) {
				await context.init(
					data && name in (data[type] ?? {})
						? { context: data[type]![name] }
						: undefined,
				);
				this.#map[type][1].push(context as any);
			}
			this.#map[type][1].sort(compareContext);
		}
	}
	entires<T extends NodeType>(
		type: T,
	): ArrayIterator<
		PluginContext<unknown, Plugin<T, TypeToParseResult<T>, unknown>>
	> {
		return this.#map[type][1].values() as any;
	}
	get<T extends NodeType>(
		type: T,
		name: string,
	):
		| PluginContext<unknown, Plugin<T, TypeToParseResult<T>, unknown>>
		| undefined {
		return this.#map[type][0].get(name);
	}
}

type AnyPluginMap = Map<string, Plugin<NodeType>>;

function verifyPlugin(plugin: Plugin<NodeType>) {
	if (!plugin || typeof plugin !== 'object') {
		throw new Error('Plugin must be a valid object');
	}
	if (!['atomic', 'inline', 'block'].includes(plugin.type)) {
		throw new Error(
			`Invalid plugin type: '${plugin.type}'. Must be one of 'atomic', 'inline', or 'block'`,
		);
	}
	if (typeof plugin.name !== 'string') {
		throw new Error('Plugin name must be a string');
	}
	if (
		!(
			['function', 'string'].includes(typeof plugin.start) ||
			plugin.start instanceof RegExp
		)
	) {
		throw new Error('Plugin must have a "start" function');
	}
	if (typeof plugin.parse !== 'function') {
		throw new Error('Plugin must have a "parse" function');
	}
	if (typeof plugin.render !== 'function') {
		throw new Error('Plugin must have a "render" function');
	}
}

export class PluginsManager {
	#map: PluginsMap = {
		atomic: new Map<string, Plugin<'atomic'>>(),
		inline: new Map<string, Plugin<'inline'>>(),
		block: new Map<string, Plugin<'block'>>(),
	};
	constructor() {
		this.set(
			...plugins.base(),
			plugins.bold,
			plugins.italic,
			plugins.boldItalic,
			plugins.del,
			plugins.code,
			plugins.imageInline,
			plugins.imageBlock,
			plugins.imageInlineRef,
			plugins.imageBlockRef,
			...plugins.link(),
			...plugins.heading(),
			plugins.blockquote,
			plugins.hr,
			plugins.orderedList,
			plugins.unorderedList,
			plugins.taskList(),
			plugins.table,
			...plugins.codeblock(),
			...plugins.footnote(),
			...plugins.tex(),
		);
	}
	/**
	 * 设置插件
	 * @returns 是否存在插件覆盖
	 */
	set(...plugins: Plugin<NodeType>[]): boolean {
		let override = false;
		for (const plugin of plugins) {
			verifyPlugin(plugin);
			if (this.#map[plugin.type].has(plugin.name)) override = true;
			(this.#map[plugin.type] as AnyPluginMap).set(plugin.name, plugin);
		}
		return override;
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
		let removed = false;
		for (const plugin of plugins) {
			if (this.#map[plugin.type].delete(plugin.name)) removed = true;
		}
		if (typeof arg0 === 'string' && typeof arg1 === 'string') {
			return this.#map[arg0].delete(arg1) || removed;
		}
		if (
			arg0 &&
			typeof arg0 === 'object' &&
			this.#map[arg0.type].delete(arg0.name)
		) {
			removed = true;
		}
		if (
			arg1 &&
			typeof arg1 === 'object' &&
			this.#map[arg1.type].delete(arg1.name)
		) {
			removed = true;
		}
		return removed;
	}
	/** 合并插件并生成插件图 */
	getPluginsMap(...managers: PluginsManager[]): PluginsMap {
		const map: PluginsMap = {
			atomic: new Map(this.#map.atomic),
			inline: new Map(this.#map.inline),
			block: new Map(this.#map.block),
		};
		for (const manager of managers) {
			for (const type of Object.keys(this.#map) as (keyof PluginsMap)[]) {
				mergeMap(map[type] as AnyPluginMap, manager.#map[type]);
			}
		}
		return map;
	}
}
