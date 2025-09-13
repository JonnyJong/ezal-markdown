import { NODE_TYPES, Node, NodeType, ParsedChild } from './node';
import {
	ASTPlugin,
	CommonPlugin,
	Context,
	Nested,
	Parsed,
	Plugin,
	RendererPlugin,
	TokenizeOptions,
} from './types';
import { entiresNested, mergeMap } from './utils';

export interface PluginLogger {
	/** 输出调试日志 */
	debug(message: string, errObj?: unknown): void;
	/** 输出一般日志 */
	info(message: string, errObj?: unknown): void;
	/** 输出警告日志 */
	warn(message: string, errObj?: unknown): void;
	/** 输出错误日志 */
	error(message: string, errObj?: unknown): void;
}

type AnyPluginMap = Map<string, Plugin<any>>;
export type PluginsMap = {
	[K in NodeType]: Map<string, Plugin<K>>;
};

//#region Manager

function checkPlugin(input: unknown): input is Plugin {
	if (!input) return false;
	if (typeof input !== 'object') return false;
	if (!('name' in input) || typeof input.name !== 'string') return false;
	if (!('type' in input) || typeof input.type !== 'string') return false;
	if (!('render' in input)) return false;
	if (!(NODE_TYPES as string[]).includes(input.type)) {
		throw new Error(
			`Invalid plugin type: '${input.type}'. Must be one of '${NODE_TYPES.join("', '")}'`,
		);
	}
	if (typeof input.render !== 'function') {
		throw new Error('Plugin must have a "render" function');
	}
	return true;
}

export class PluginsManager {
	#map: PluginsMap = {
		inline: new Map(),
		block: new Map(),
	};
	/**
	 * 设置插件
	 * @throws 当存在校验失败的插件时，抛出错误，且不会设置任何插件
	 * @returns 是否存在插件覆盖
	 */
	set(...plugins: Nested<Plugin<NodeType>>[]): boolean {
		let override = false;
		for (const plugin of [...entiresNested(plugins, checkPlugin)]) {
			if (this.#map[plugin.type].has(plugin.name)) override = true;
			this.#map[plugin.type].set(plugin.name, plugin as any);
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

//#region Context

/** 插件内上下文 */
export type PluginsContextData = { [K in NodeType]?: { [k: string]: unknown } };

/** 插件上下文 */
export class PluginContext<
	T extends NodeType = NodeType,
	C = unknown,
	P extends Plugin<T, Parsed, Node, C> = Plugin<T, Parsed, Node, C>,
> implements Omit<Context, 'plugins' | 'logger'>
{
	#context: Context;
	#plugin: P;
	#logger: PluginLogger = Object.freeze({
		debug: (message, errObj) =>
			this.#context.logger.debug({
				type: this.#plugin.type,
				name: this.#plugin.name,
				message,
				errObj,
			}),
		info: (message, errObj) =>
			this.#context.logger.info({
				type: this.#plugin.type,
				name: this.#plugin.name,
				message,
				errObj,
			}),
		warn: (message, errObj) =>
			this.#context.logger.warn({
				type: this.#plugin.type,
				name: this.#plugin.name,
				message,
				errObj,
			}),
		error: (message, errObj) =>
			this.#context.logger.error({
				type: this.#plugin.type,
				name: this.#plugin.name,
				message,
				errObj,
			}),
	} satisfies PluginLogger);
	#md = (
		content: string,
		options?: Partial<TokenizeOptions> | NodeType,
	): ParsedChild => {
		let type: NodeType = this.#plugin.type;
		if (typeof options === 'string') {
			if (type === 'block') type = options;
			options = undefined;
		} else if (typeof options?.maxLevel === 'string' && type === 'block') {
			type = options.maxLevel;
		}
		return new ParsedChild(type, content, options);
	};
	/** 插件内上下文 */
	self!: C;
	constructor(context: Context, plugin: P) {
		this.#context = context;
		this.#plugin = plugin;
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
	get refMap() {
		return this.#context.refMap;
	}
	get plugin() {
		return this.#plugin;
	}
	get logger() {
		return this.#logger;
	}
	/**
	 * 构造待处理的子 Markdown 内容
	 * @description
	 * 子内容的处理级别小于等于插件级别，
	 * 若指定级别大于插件级别，则按照插件级别处理
	 */
	get md() {
		return this.#md;
	}
}

export function comparePriority(
	a: PluginContext<NodeType>,
	b: PluginContext<NodeType>,
): number {
	if (!('priority' in a.plugin)) return 0;
	if (!('priority' in b.plugin)) return 0;
	const pA = a.plugin.priority ?? 0;
	const pB = b.plugin.priority ?? 0;
	if (pB !== pA) return pB - pA;
	const nA = a.plugin.name;
	const nB = b.plugin.name;
	if (nA > nB) return -1;
	if (nA < nB) return 1;
	return 0;
}

function compareOrder(
	a: [order: number, ...any],
	b: [order: number, ...any],
): number {
	return b[0] - a[0];
}

export function isCommon<T extends NodeType>(
	context: PluginContext<T>,
): context is CommonPluginContext<T> {
	if (!('parse' in context.plugin)) return false;
	if (!('start' in context.plugin)) return false;
	if (typeof context.plugin.parse !== 'function') return false;
	return (
		['function', 'string'].includes(typeof context.plugin.start) ||
		context.plugin.start instanceof RegExp
	);
}

export function isAst<T extends NodeType>(
	context: PluginContext<T>,
): context is ASTPluginContext<T> {
	if (!('parse' in context.plugin)) return false;
	if (!('phase' in context.plugin)) return false;
	if (!('verifyNode' in context.plugin)) return false;
	if (typeof context.plugin.parse !== 'function') return false;
	if (typeof context.plugin.verifyNode !== 'function') return false;
	if (!['pre', 'post'].includes(context.plugin.phase)) return false;
	return true;
}

export type ASTPluginContext<T extends NodeType> = PluginContext<
	T,
	any,
	ASTPlugin<T, Node, any>
>;
export type CommonPluginContext<T extends NodeType> = PluginContext<
	T,
	any,
	CommonPlugin<T, Parsed, any>
>;
export type RendererPluginContext<T extends NodeType> = PluginContext<
	T,
	any,
	RendererPlugin<T, Parsed, any>
>;

export type OrderedPlugins<T extends NodeType> = [
	ASTPluginContext<T>[],
	CommonPluginContext<T>[][],
	ASTPluginContext<T>[],
];
type PluginContextMapData = {
	[K in NodeType]: [
		Map<string, PluginContext<K>>,
		OrderedPlugins<K>,
		ASTPluginContext<K>[],
		Map<string, CommonPluginContext<K> | RendererPluginContext<K>>,
	];
};

/** 插件及上下文图 */
export class PluginContextMap {
	#map: PluginContextMapData = {
		block: [new Map(), [[], [], []], [], new Map()],
		inline: [new Map(), [[], [], []], [], new Map()],
	};
	constructor(
		plugins: PluginsMap,
		context: Omit<Context, 'plugins'> & { plugins?: PluginContextMap },
	) {
		context.plugins = this;
		for (const type of NODE_TYPES) {
			for (const [name, plugin] of plugins[type]) {
				this.#map[type][0].set(
					name,
					new PluginContext(context as Context, plugin as any) as any,
				);
			}
		}
	}
	/** 初始化插件 */
	async init(data?: PluginsContextData) {
		for (const type of NODE_TYPES) {
			const map = new Map<number, CommonPluginContext<typeof type>[]>();
			for (const [name, context] of this.#map[type][0]) {
				// Init
				await context.init(
					data?.[type] && name in data[type]
						? { context: data[type][name] }
						: undefined,
				);
				// Common
				if (isCommon(context)) {
					const order = Math.trunc(context.plugin.order ?? 0);
					let plugins = map.get(order);
					if (!plugins) {
						plugins = [];
						map.set(order, plugins);
					}
					plugins.push(context);
				}
				// AST
				if (isAst(context)) {
					this.#map[type][1][context.plugin.phase === 'pre' ? 0 : 2].push(
						context as any,
					);
					this.#map[type][2].push(context as any);
					continue;
				}
				this.#map[type][3].set(context.plugin.name, context as any);
			}
			// Order
			this.#map[type][1][0].sort(comparePriority);
			this.#map[type][1][2].sort(comparePriority);
			const plugins: [order: number, CommonPluginContext<typeof type>[]][] = [];
			for (const [order, p] of map) {
				p.sort(comparePriority);
				plugins.push([order, p]);
			}
			plugins.sort(compareOrder);
			for (const [_, p] of plugins) {
				this.#map[type][1][1].push(p as any);
			}
		}
	}
	/** 按阶段获取插件 */
	fetch<T extends NodeType, S extends 0 | 1 | 2>(
		type: T,
		state: S,
	): OrderedPlugins<T>[S] {
		return this.#map[type][1][state];
	}
	/** 获取渲染/普通插件 */
	get<T extends NodeType>(
		type: T,
		name: string,
	): RendererPluginContext<T> | CommonPluginContext<T> | undefined {
		return this.#map[type][3].get(name);
	}
	/** 遍历 AST 插件 */
	*entiresAst<T extends NodeType>(type: T): Generator<ASTPluginContext<T>> {
		for (const context of this.#map[type][2]) {
			yield context;
		}
	}
}
