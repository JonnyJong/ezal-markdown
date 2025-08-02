import {
	BlockParseResult,
	InlineParseResult,
	ParseChild,
	Plugin,
	PluginContext,
	PluginContextMap,
	TypeToParseResult,
	// compareContext,
} from './plugin';
import { MarkdownFormatOptions, RenderContext, RenderHooks } from './render';
import { Children, execHooks, mapChildren, omit } from './utils';

//#region Define

/** 解析参数 */
export interface TokenizeOptions {
	/**
	 * 最大级别
	 * @default `block`
	 */
	maxLevel: NodeType;
	/** 跳过段落包裹 */
	skipParagraphWrapping: boolean;
	/**
	 * 换行规则
	 * @description
	 * - `common-mark`：CommonMark 规范，行尾 2+ 空格渲染为换行
	 * - `soft`：软换行，换行符 `\n` 渲染为换行
	 * @default `common-mark`
	 */
	lineBreak: 'common-mark' | 'soft';
}

/**
 * 节点类型
 * @description
 * - `block`：块节点
 * - `inline`：行级节点
 * - `atomic`：原子节点
 */
export type NodeType = 'block' | 'inline' | 'atomic';

/** 基础节点类型 */
export interface BaseNodeInit {
	/** 节点对应插件名称 */
	name: string;
	/** 节点类型 */
	type: NodeType;
	/** 节点原始数据 */
	raw: string;
	/** 节点对应插件的自定义数据 */
	data: object;
}

/** 基础节点 */
export abstract class BaseNode implements BaseNodeInit {
	name: string;
	type: NodeType;
	raw: string;
	data: object;
	options?: Partial<MarkdownFormatOptions>;
	constructor(init: BaseNodeInit) {
		this.name = init.name;
		this.type = init.type;
		this.raw = init.raw;
		this.data = init.data;
	}
}

/** 原子节点类型 */
export interface AtomicNodeInit extends BaseNodeInit {
	/** 节点类型 */
	type: 'atomic';
}

/** 原子节点 */
export class AtomicNode extends BaseNode implements AtomicNodeInit {
	type = 'atomic' as const;
}

/** 行级节点类型 */
export interface InlineNodeInit extends BaseNodeInit {
	/** 节点类型 */
	type: 'inline';
	/** 子节点 */
	children: Children<AtomicNode | InlineNode>;
}

/** 行级节点 */
export class InlineNode extends BaseNode implements InlineNodeInit {
	type = 'inline' as const;
	children: Children<InlineNode | AtomicNode>;
	constructor(init: InlineNodeInit) {
		super(init);
		this.children = init.children;
	}
}

/** 块级节点类型 */
export interface BlockNodeInit extends BaseNodeInit {
	/** 节点类型 */
	type: 'block';
	/** 子节点 */
	children: Children<Node>;
}

/** 块级节点 */
export class BlockNode extends BaseNode implements BlockNodeInit {
	type = 'block' as const;
	children: Children<Node>;
	constructor(init: BlockNodeInit) {
		super(init);
		this.children = init.children;
	}
}

export type Node = AtomicNode | InlineNode | BlockNode;

export type TypeToNode<T extends NodeType> = T extends 'block'
	? BlockNode
	: T extends 'inline'
		? InlineNode
		: T extends 'atomic'
			? AtomicNode
			: never;

type GapRange = [from: number, to: number];

export const NODE_TYPES: readonly NodeType[] = Object.freeze([
	'block',
	'inline',
	'atomic',
]);

//#region Utils

function resolveLevel(maxLevel: NodeType): readonly NodeType[] {
	return (
		{
			block: NODE_TYPES,
			inline: ['inline', 'atomic'],
			atomic: ['atomic'],
		} satisfies { [K in NodeType]: readonly NodeType[] }
	)[maxLevel];
}

function minLevel(...levels: NodeType[]): NodeType {
	let i = 0;
	for (const level of levels) {
		i = Math.max(i, NODE_TYPES.indexOf(level));
	}
	return NODE_TYPES[i];
}

function node(init: AtomicNodeInit): AtomicNode;
function node(init: InlineNodeInit): InlineNode;
function node(init: BlockNodeInit): BlockNode;
function node(init: AtomicNodeInit | InlineNodeInit | BlockNodeInit) {
	if (init.type === 'atomic') return new AtomicNode(init);
	if (init.type === 'inline') return new InlineNode(init);
	if (init.type === 'block') return new BlockNode(init);
	throw new Error(`Unknown node type encountered: '${(init as any).type}'`);
}

//#region Parse

async function findStart(
	source: string,
	context: PluginContext<unknown, Plugin<NodeType, any, any>>,
): Promise<number> {
	if (typeof context.plugin.start === 'string') {
		return source.indexOf(context.plugin.start);
	}
	if (context.plugin.start instanceof RegExp) {
		const matched = source.match(context.plugin.start);
		return matched?.index ?? -1;
	}
	const result = await context.plugin.start(source, context);
	if (typeof result === 'number') return result;
	if (typeof result?.index === 'number') return result.index;
	return -1;
}

async function parse<T extends NodeType>(
	source: string,
	type: T,
	plugins: PluginContextMap,
): Promise<([name: string, parsed: TypeToParseResult<T>] | GapRange)[]> {
	// Start
	const startsMap = new Map<number, string[]>();
	for (const context of plugins.entires(type)) {
		const name = context.plugin.name;
		let offset = 0;
		while (offset < source.length) {
			const index = await findStart(source.slice(offset), context);
			if (index < 0) break;
			offset += index;
			let names = startsMap.get(offset);
			if (!names) {
				names = [];
				startsMap.set(offset, names);
			}
			names.push(name);
			if (type === 'block') {
				const next = source.indexOf('\n', offset);
				if (next === -1) break;
				offset = next + 1;
			} else offset += 1;
		}
	}
	// Parse
	const starts = [...startsMap.entries()].sort((a, b) => a[0] - b[0]);
	const tokens: ([name: string, parsed: TypeToParseResult<T>] | GapRange)[] = [];
	let offset = 0;
	for (const [index, names] of starts) {
		if (offset >= source.length) continue;
		if (index < offset) continue;
		for (const name of names) {
			const context = plugins.get(type, name)!;
			const parsed = await context.plugin.parse(source.slice(index), context);
			if (!parsed) continue;
			if (index !== offset) tokens.push([offset, index]);
			tokens.push([name, parsed]);
			offset = index + parsed.raw.length;
			break;
		}
	}
	if (offset < source.length) tokens.push([offset, source.length]);
	return tokens;
}

//#region Transform

async function transform<T extends NodeType>(
	type: T,
	name: string,
	parsed: TypeToParseResult<T>,
	context: RenderContext,
	options: TokenizeOptions,
	hooks: RenderHooks,
): Promise<TypeToNode<T>> {
	if (type === 'atomic') {
		return node({
			type,
			name,
			raw: parsed.raw,
			data: omit(parsed, ['raw']),
		}) as TypeToNode<T>;
	}
	const children = (parsed as InlineParseResult | BlockParseResult).children
		? await mapChildren(
				(parsed as InlineParseResult | BlockParseResult).children!,
				(v) => v instanceof ParseChild,
				async (child): Promise<Node[]> =>
					(
						await tokenize(
							child.content,
							context,
							{
								...options,
								...child.options,
								maxLevel: minLevel(type, child.options?.maxLevel ?? type),
							},
							hooks,
						)
					).map((node) => {
						node.options = child.options;
						return node;
					}),
			)
		: undefined;
	return node({
		type,
		name,
		raw: parsed.raw,
		data: omit(parsed, ['raw', 'children']),
		children,
	} as any) as TypeToNode<T>;
}

//#region Normalize

const LINE_BREAK_NAME = ['break-hard', 'break-soft'];
function isLineBreak(token: Node): boolean {
	if (token.type !== 'atomic') return false;
	return LINE_BREAK_NAME.includes(token.name);
}

function normalizeTrim(tokens: Node[]): Node[] {
	let start = 0;
	let end = tokens.length - 1;
	while (true) {
		if (start >= tokens.length) break;
		if (!isLineBreak(tokens[start])) break;
		start++;
	}
	while (true) {
		if (end < 0) break;
		if (!isLineBreak(tokens[end])) break;
		end--;
	}
	return tokens.slice(start, end + 1);
}

function normalizeBreak(
	tokens: Node[],
	rule: TokenizeOptions['lineBreak'],
): Node[] {
	const result: Node[] = [];
	let preIsBreak = false;
	let insertedBreak = false;
	let prevNonBreakType: NodeType = 'block';
	for (const token of tokens) {
		if (!isLineBreak(token)) {
			if (
				prevNonBreakType !== 'block' &&
				token.type !== 'block' &&
				preIsBreak &&
				!insertedBreak
			) {
				result.push(
					node({
						type: 'atomic',
						name: 'text',
						raw: '\n',
						data: {},
					}),
				);
			}
			prevNonBreakType = token.type;
			preIsBreak = false;
			insertedBreak = false;
			result.push(token);
			continue;
		}
		if (insertedBreak) continue;
		if (token.name === 'break-hard') {
			preIsBreak = true;
			insertedBreak = true;
			result.push(token);
			continue;
		}
		if (rule === 'common-mark') {
			if (preIsBreak) {
				insertedBreak = true;
				result.push(token);
			}
			preIsBreak = true;
			continue;
		}
		if (preIsBreak) continue;
		preIsBreak = true;
		insertedBreak = true;
		result.push(token);
	}
	return result;
}

function createParagraphNode(): BlockNode & { children: Node[] } {
	return node({
		type: 'block',
		name: 'paragraph',
		raw: '',
		data: {},
		children: [],
	}) as BlockNode & { children: Node[] };
}

function normalizeParagraph(
	tokens: Node[],
	rule: TokenizeOptions['lineBreak'],
): Node[] {
	const result: Node[] = [];
	let para = createParagraphNode();
	let hasContent = false;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.type === 'block') {
			if (!hasContent) {
				result.push(token);
				continue;
			}
			para.children = normalizeBreak(normalizeTrim(para.children), rule);
			if (para.children.length > 0) result.push(para);
			para = createParagraphNode();
			hasContent = false;
			result.push(token);
			continue;
		}
		para.children.push(token);
		if (!isLineBreak(token)) {
			hasContent = true;
			continue;
		}
		if (!hasContent || i === 0 || !isLineBreak(tokens[i - 1])) continue;
		para.children = normalizeBreak(normalizeTrim(para.children), rule);
		if (para.children.length > 0) result.push(para);
		para = createParagraphNode();
		hasContent = false;
	}

	if (!hasContent) return result;
	para.children = normalizeBreak(normalizeTrim(para.children), rule);
	if (para.children.length > 0) result.push(para);

	return result;
}

function normalize(tokens: Node[], options: TokenizeOptions): Node[] {
	tokens = normalizeTrim(tokens);
	if (!options.skipParagraphWrapping) {
		tokens = normalizeParagraph(tokens, options.lineBreak);
	}
	return normalizeBreak(tokens, options.lineBreak);
}

//#region Main

export async function tokenize(
	source: string,
	context: RenderContext,
	options: TokenizeOptions,
	hooks: RenderHooks,
): Promise<Node[]> {
	source = await execHooks(source, hooks.preTokenize);
	const tokens: (Node | GapRange)[] = [[0, source.length]];
	for (const type of resolveLevel(options.maxLevel)) {
		for (let i = 0; i < tokens.length; i++) {
			if (!Array.isArray(tokens[i])) continue;
			const [from, to] = tokens.splice(i, 1)[0] as GapRange;
			const result = await parse(source.slice(from, to), type, context.plugins);
			for (const parsed of result) {
				if (typeof parsed[0] === 'number' && typeof parsed[1] === 'number') {
					tokens.splice(i, 0, [from + parsed[0], from + parsed[1]]);
					i++;
					continue;
				}
				const transformed = await transform(
					type,
					parsed[0] as string,
					parsed[1] as TypeToParseResult<typeof type>,
					context,
					{
						...options,
						skipParagraphWrapping: false,
					},
					hooks,
				);
				tokens.splice(i, 0, transformed);
				i++;
			}
		}
	}
	for (let i = 0; i < tokens.length; i++) {
		if (!Array.isArray(tokens[i])) continue;
		const [from, to] = tokens[i] as GapRange;
		tokens[i] = node({
			type: 'atomic',
			name: 'text',
			raw: source.slice(from, to),
			data: {},
		});
	}
	if (options.maxLevel !== 'block') options.skipParagraphWrapping = true;
	return execHooks(
		await execHooks(
			normalize(await execHooks(tokens as Node[], hooks.preNormalize), options),
			hooks.postNormalize,
		),
		hooks.postTokenize,
	);
}
