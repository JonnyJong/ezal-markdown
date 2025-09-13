import { Node, ParsedNode, Text } from '../node';
import { RefMap, normalizeLabel } from '../ref-map';
import { ASTPlugin } from '../types';
import { $, escapeMarkdown } from '../utils';
import { DEFAULT_RESOLVER, LinkTargetResolver } from './autolink';

export interface EmphasisAndLinkOption {
	/** 链接目标解析器 */
	targetResolver?: LinkTargetResolver;
	/**
	 * 禁用强调、加强强调语法
	 * @see https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis
	 */
	disableEmphasis?: boolean;
	/**
	 * 禁用链接语法
	 * @see https://spec.commonmark.org/0.31.2/#links
	 */
	disableLinks?: boolean;
	/**
	 * 禁用图像语法
	 * @see https://spec.commonmark.org/0.31.2/#images
	 */
	disableImages?: boolean;
	/**
	 * 禁用删除线语法
	 * @see https://github.github.com/gfm/#strikethrough-extension-
	 */
	disableStrikethrough?: boolean;
}

type DelimiterType = '[' | '![' | ']' | '*' | '_' | '~';
interface Delimiter {
	node: Text;
	type: DelimiterType;
	length: number;
	active: boolean;
	canOpen: boolean;
	canClose: boolean;
}

//#region Utils

function removeDelimiter(
	stack: Delimiter[],
	start: number,
	end: number,
): number {
	stack.splice(end, 1);
	stack.splice(start, 1);
	return end - 2;
}

function pickNodes(from: Node): Node[];
function pickNodes(from: Node, to: Node): Node[] | undefined;
function pickNodes(from: Node, to?: Node): Node[] | undefined {
	const nodes: Node[] = [];
	let node: Node | null = from.next();
	while (node) {
		if (node === to) return nodes;
		nodes.push(node);
		node = node.next();
	}
	if (to) return;
	return nodes;
}

export function pickNodesHasRaw(from: Node): Node[];
export function pickNodesHasRaw(from: Node, to: Node): Node[] | undefined;
export function pickNodesHasRaw(from: Node, to?: Node): Node[] | undefined {
	const nodes: Node[] = [];
	let node: Node | null = from.next();
	while (node) {
		if (node.raw === undefined) break;
		if (node === to) return nodes;
		nodes.push(node);
		node = node.next();
	}
	if (to) return;
	return nodes;
}

export function nodesToRaw(nodes: Node[]): string | undefined {
	let result = '';
	for (const node of nodes) {
		if (node.raw === undefined) return;
		result += node.raw;
	}
	return result;
}

export function removeNodesByStringLength(nodes: Node[], length: number) {
	for (const node of nodes) {
		if (length <= 0) return;
		// XXX：不应该出现的状况，可能需要更好的决策
		if (node.raw === undefined) {
			node.remove();
			continue;
		}
		if (node instanceof Text) {
			const len = node.raw.length;
			node.raw = node.raw.slice(length);
			length -= len;
			if (node.raw.length === 0) node.remove();
			continue;
		}
		const text = node.raw.slice(length);
		length -= node.raw.length;
		if (text) node.before(new Text(text));
		node.remove();
	}
}

//#region Utils: Link & Image
const PATTERN_GAP = /^[ \t]*\n?[ \t]*/;
const PATTERN_DEST_1_END = /(\\*)(<|>)/;
const PATTERN_DEST_2_END = /[\u0000-\u001F\u007F ]/;
const PATTERN_DEST_2_BRACKET = /(\\*)(\(|\))/;
const PATTERN_TITLE_1_END = /(\\*)"/;
const PATTERN_TITLE_2_END = /(\\*)'/;
const PATTERN_TITLE_3_END = /(\\*)(\(|\))/;
const PATTERN_LABEL_END = /(\\*)(\[|\])/;

/**
 * 链接目的地长度
 * @param source 输入从起始括号 `(` 后开始
 * @see https://spec.commonmark.org/0.31.2/#link-destination
 */
export function destinationLengthOf(source: string): number {
	let end = source.indexOf('\n');
	if (end !== -1) source = source.slice(0, end);

	let length = 0;
	if (source[0] === '<') {
		length = 1;
		while (length < source.length) {
			const matched = source.slice(length).match(PATTERN_DEST_1_END);
			if (matched?.index === undefined) return 0;
			length += matched[0].length + matched.index;
			if (matched[1].length % 2) continue;
			return matched[2] === '>' ? length : 0;
		}
	}

	end = source.match(PATTERN_DEST_2_END)?.index ?? -1;
	if (end !== -1) source = source.slice(0, end);
	let depth = 0;
	while (length < source.length) {
		const matched = source.slice(length).match(PATTERN_DEST_2_BRACKET);
		if (matched?.index === undefined) return source.length;
		length += matched[0].length + matched.index;
		if (matched[1].length % 2) continue;
		depth += matched[2] === '(' ? 1 : -1;
		if (depth < 0) return length - 1;
	}
	return depth === 0 ? length : 0;
}
/**
 * 链接标题长度
 * @see https://spec.commonmark.org/0.31.2/#link-title
 */
export function titleLengthOf(source: string): number {
	let length = 1;
	if (source[0] === `"`) {
		while (length < source.length) {
			const matched = source.slice(length).match(PATTERN_TITLE_1_END);
			if (matched?.index === undefined) return 0;
			length += matched[0].length + matched.index;
			if (matched[1].length % 2) continue;
			return length;
		}
		return 0;
	}
	if (source[0] === `'`) {
		while (length < source.length) {
			const matched = source.slice(length).match(PATTERN_TITLE_2_END);
			if (matched?.index === undefined) return 0;
			length += matched[0].length + matched.index;
			if (matched[1].length % 2) continue;
			return length;
		}
		return 0;
	}
	if (source[0] === '(') {
		while (length < source.length) {
			const matched = source.slice(length).match(PATTERN_TITLE_3_END);
			if (matched?.index === undefined) return 0;
			length += matched[0].length + matched.index;
			if (matched[1].length % 2) continue;
			return matched[2] === ')' ? length : 0;
		}
		return 0;
	}
	return 0;
}
/**
 * 链接标签长度
 * @param source 输入从起始括号 `[` 前开始
 * @see https://spec.commonmark.org/0.31.2/#link-label
 */
export function labelLengthOf(source: string): number {
	let length = 1;
	while (length <= source.length) {
		const matched = source.slice(length).match(PATTERN_LABEL_END);
		if (matched?.index === undefined) return 0;
		length += matched[0].length + matched.index;
		if (matched[1].length % 2) continue;
		return matched[2] === ']' ? length : 0;
	}
	return 0;
}
/** 间隔长度 */
export function gapLengthOf(source: string): number {
	const gap = source.match(PATTERN_GAP);
	return gap?.[0].length ?? 0;
}

interface LinkRest {
	length: number;
	destination?: string;
	title?: string;
	label?: string;
}
function parseLinkRest(source: string): LinkRest | undefined {
	// Reference: full & collapsed
	if (source[0] === '[') {
		const length = labelLengthOf(source);
		if (length > 2) return { length, label: source.slice(1, length - 1) };
		if (length !== 2) return;
		return { length };
	}
	// Inline:
	if (source[0] !== '(') return;
	let length = 1;
	// Gap
	length += gapLengthOf(source.slice(length));
	if (source[length] === ')') return { length: length + 1, destination: '' };
	// Destination
	const destinationLength = destinationLengthOf(source.slice(length));
	if (!destinationLength) return;
	let destination = source.slice(length, length + destinationLength);
	if (destination[0] === '<') destination = destination.slice(1, -1);
	destination = encodeURI(decodeURI(escapeMarkdown(destination)));
	length += destinationLength;
	// Gap
	length += gapLengthOf(source.slice(length));
	if (source[length] === ')') return { length: length + 1, destination };
	// Title
	const titleLength = titleLengthOf(source.slice(length));
	if (!titleLength) return;
	const title = escapeMarkdown(
		source.slice(length + 1, length + titleLength - 1),
	);
	length += titleLength;
	// Gap
	length += gapLengthOf(source.slice(length));
	if (source[length] !== ')') return;
	length++;
	// End
	return { length, destination, title };
}

interface LinkInfo {
	preceded?: string;
	length: number;
	destination: string;
	title?: string;
	label?: string;
}
function getLinkInfo(
	refMap: RefMap,
	precededNodes: Node[],
	followed: string,
): LinkInfo | undefined {
	const rest = parseLinkRest(followed);
	const preceded = nodesToRaw(precededNodes);
	// Reference: shortcut
	if (!rest) {
		if (preceded === undefined) return;
		const label = normalizeLabel(preceded);
		const link = refMap.get(label);
		if (!link) return;
		return { ...link, length: 0, preceded };
	}
	// Inline
	if (rest.destination !== undefined) {
		return { ...rest, preceded } as LinkInfo;
	}
	// Reference: full
	if (rest.label !== undefined) {
		const link = refMap.get(rest.label);
		if (!link) return;
		return { ...rest, ...link, preceded };
	}
	// Reference: collapsed
	if (preceded === undefined) return;
	const label = normalizeLabel(preceded);
	const link = refMap.get(label);
	if (!link) return;
	return { ...link, length: 2, preceded };
}

//#region Init
/**
 * @description
 * A Unicode whitespace character is
 * a character in the Unicode Zs general category,
 * or a tab (U+0009), line feed (U+000A), form feed (U+000C),
 * or carriage return (U+000D).
 * @see https://spec.commonmark.org/0.31.2/#unicode-whitespace-character
 */
const UNICODE_WHITESPACE_CHARACTER = /[\p{Zs}\u0009\u000A\u000C\u000D]|^$/u;
/**
 * @description
 * A Unicode punctuation character is a character
 * in the Unicode P (puncuation) or S (symbol) general categories.
 * @see https://spec.commonmark.org/0.31.2/#unicode-punctuation-character
 */
const UNICODE_PUNCTUATION_CHARACTER = /[\p{P}\p{S}]/u;

/**
 * 获取前一个字符
 * @description
 * 若无前一个字符，返回 ''；
 * 若前一个字符为转义字符，返回等效字符 '+'；
 */
function getPrecededChar(node: Node): string {
	while (true) {
		const prev = node.prev();
		if (!prev || prev.type === 'block') return '';
		if (prev instanceof ParsedNode && prev.name === 'escape') return '+';
		if (prev.raw === undefined) return '';
		if (prev.raw) return prev.raw.at(-1) ?? '';
		node = prev;
	}
}
/**
 * 获取后一个字符
 * @description
 * 若无后一个字符，返回 ''；
 * 若后一个字符为转义字符，返回等效字符 '+'；
 */
function getFollowedChar(node: Node): string {
	while (true) {
		const next = node.next();
		if (!next || next.type === 'block') return '';
		if (next instanceof ParsedNode && next.name === 'escape') return '+';
		if (next.raw === undefined) return '';
		if (next.raw) return next.raw[0] ?? '';
		node = next;
	}
}

const EMPH_DELIMITER = ['*', '_', '~'];
/**
 * 检查是否为 left-flanking delimiter run
 * @description
 * CommonMark Spec 原始定义：
 * A left-flanking delimiter run is a delimiter run
 * that is (1) not followed by Unicode whitespace,
 * and either (2a) not followed by a Unicode punctuation character,
 * or (2b) followed by a Unicode punctuation character
 * and preceded by Unicode whitespace or a Unicode punctuation character.
 * For purposes of this definition,
 * the beginning and the end of the line count as Unicode whitespace.
 * @param precededChar 分隔符前字符（若无字符请输入 ''）
 * @param followedChar 分隔符后字符（若无字符请输入 ''）
 * @see https://spec.commonmark.org/0.31.2/#left-flanking-delimiter-run
 */
function isLeftFlankingDelimiterRun(
	precededChar: string,
	followedChar: string,
	type: '*' | '_' | '~',
): boolean {
	if (precededChar === type || followedChar === type) return false;
	// (1)
	if (UNICODE_WHITESPACE_CHARACTER.test(followedChar)) return false;
	// (2)
	if (EMPH_DELIMITER.includes(followedChar)) return true;
	if (UNICODE_PUNCTUATION_CHARACTER.test(followedChar)) {
		// (2b)
		if (UNICODE_WHITESPACE_CHARACTER.test(precededChar)) return true;
		if (UNICODE_PUNCTUATION_CHARACTER.test(precededChar)) return true;
		// (2a)
		return false;
	}
	return true;
}
/**
 * 检查是否为 right-flanking delimiter run
 * @description
 * CommonMark Spec 原始定义：
 * A right-flanking delimiter run is a delimiter run
 * that is (1) not preceded by Unicode whitespace,
 * and either (2a) not preceded by a Unicode punctuation character,
 * or (2b) preceded by a Unicode punctuation character
 * and followed by Unicode whitespace or a Unicode punctuation character.
 * For purposes of this definition,
 * the beginning and the end of the line count as Unicode whitespace.
 * @param precededChar 分隔符前字符（若无字符请输入 ''）
 * @param followedChar 分隔符后字符（若无字符请输入 ''）
 * @see https://spec.commonmark.org/0.31.2/#right-flanking-delimiter-run
 */
function isRightFlankingDelimiterRun(
	precededChar: string,
	followedChar: string,
	type: '*' | '_' | '~',
): boolean {
	if (precededChar === type || followedChar === type) return false;
	// (1)
	if (UNICODE_WHITESPACE_CHARACTER.test(precededChar)) return false;
	// (2)
	if (EMPH_DELIMITER.includes(precededChar)) return true;
	if (UNICODE_PUNCTUATION_CHARACTER.test(precededChar)) {
		// (2b)
		if (UNICODE_WHITESPACE_CHARACTER.test(followedChar)) return true;
		if (UNICODE_PUNCTUATION_CHARACTER.test(followedChar)) return true;
		// (2a)
		return false;
	}
	return true;
}

function getDelimiter(node: Text): Delimiter {
	// Type
	let type: DelimiterType;
	if (node.raw[0] === '!') type = '![';
	else if (node.raw[0] === '[') type = '[';
	else if (node.raw[0] === '*') type = '*';
	else if (node.raw[0] === '_') type = '_';
	else if (node.raw[0] === '~') type = '~';
	else type = ']';
	// Open & Close
	let canOpen = true;
	let canClose = true;
	if (type === '![' || type === '[') {
		canClose = false;
	} else if (type === ']') {
		canOpen = false;
	} else {
		const precededChar = getPrecededChar(node);
		const followedChar = getFollowedChar(node);
		canOpen = isLeftFlankingDelimiterRun(precededChar, followedChar, type);
		canClose = isRightFlankingDelimiterRun(precededChar, followedChar, type);
		// 2 & 4
		if (type === '_') {
			const left = canOpen;
			const right = canClose;
			canOpen =
				left && (!right || UNICODE_PUNCTUATION_CHARACTER.test(precededChar));
			canClose =
				right && (!left || UNICODE_PUNCTUATION_CHARACTER.test(followedChar));
		}
	}
	return {
		node,
		type,
		length: node.raw.length,
		active: true,
		canOpen,
		canClose,
	};
}

function createStacks(
	root: Node,
	options?: EmphasisAndLinkOption,
): Delimiter[][] {
	const delimiters: string[] = [];
	if (!options?.disableEmphasis) delimiters.push('\\*+', '_+');
	if (!options?.disableStrikethrough) delimiters.push('(?<!~)~{1,2}(?!~)');
	if (!options?.disableImages) delimiters.push('!\\[');
	if (!options?.disableLinks) delimiters.push('\\[');
	if (!(options?.disableImages && options?.disableLinks)) delimiters.push('\\]');
	const pattern = new RegExp(delimiters.join('|'));
	const stacks: Delimiter[][] = [];
	let stack: Delimiter[] | null = null;
	for (let i = 0; ; i++) {
		const child = root.child(i);
		if (!child) break;
		// 文本节点
		if (child instanceof Text) {
			while (true) {
				const matched = child.raw.match(pattern);
				if (matched?.index === undefined) break;
				// 分割
				const nodes = child.splitAt(
					matched.index,
					matched.index + matched[0].length,
				);
				const node = nodes[matched.index ? 1 : 0];
				if (matched.index) i++;
				// 分隔符
				if (!stack) {
					stack = [];
					stacks.push(stack);
				}
				stack.push(getDelimiter(node));
				if (!child.parent || nodes[0] === child) break;
			}
		}
		// 其他节点
		if (child.type === 'block') stack = null;
	}
	return stacks;
}

//#region Emph & Strikethrough

/** 强调节点 */
export class EmphNode extends Node {
	constructor(delimiter: Delimiter, nodes: Node[]) {
		super('emph', 'inline');
		this.#delimiter = delimiter.type as any;
		this.append(...nodes);
		const raw = nodesToRaw(nodes);
		if (raw !== undefined) this.raw = this.#delimiter + raw + this.#delimiter;
		Text.normalize(this);
	}
	#delimiter: '*' | '_';
	get delimiter() {
		return this.#delimiter;
	}
}

/** 加强强调节点 */
export class StrongNode extends Node {
	constructor(delimiter: Delimiter, nodes: Node[]) {
		super('strong', 'inline');
		this.#delimiter = delimiter.type as any;
		this.append(...nodes);
		const raw = nodesToRaw(nodes);
		if (raw !== undefined) {
			this.raw = this.#delimiter.repeat(2) + raw + this.#delimiter.repeat(2);
		}
		Text.normalize(this);
	}
	#delimiter: '*' | '_';
	get delimiter() {
		return this.#delimiter;
	}
}

/** 删除线节点 */
export class DelNode extends Node {
	constructor(delimiter: Delimiter, nodes: Node[]) {
		super('del', 'inline');
		this.#delimiter = delimiter.length === 1 ? '~' : '~~';
		this.append(...nodes);
		const raw = nodesToRaw(nodes);
		if (raw !== undefined) this.raw = delimiter + raw + delimiter;
		Text.normalize(this);
	}
	#delimiter: '~' | '~~';
	get delimiter() {
		return this.#delimiter;
	}
}

function getEmphClass(opener: Delimiter, closer: Delimiter) {
	if (opener.type === '~') return DelNode;
	if (opener.length > 1 && closer.length > 1) return StrongNode;
	return EmphNode;
}

function getEmphLength(node: EmphNode | StrongNode | DelNode): number {
	if (node instanceof DelNode) return node.delimiter.length;
	if (node instanceof EmphNode) return 1;
	return 2;
}

function processEmph(stack: Delimiter[]) {
	// 过滤
	stack = stack.filter((d) => ['*', '_', '~'].includes(d.type));
	// 查找下界映射
	const openersBottom = new Map<string, number>();
	// 向后查找潜在闭符
	for (let closerIndex = 0; closerIndex < stack.length; ) {
		const closer = stack[closerIndex];
		if (!closer.canClose) {
			closerIndex++;
			continue;
		}
		// 确定查找下界
		const key = `${closer.type}${closer.length % 3}${closer.canOpen}`;
		const bottomIndex = openersBottom.get(key) ?? 0;
		// 向前查找匹配开符
		let openerIndex = closerIndex - 1;
		let opener: Delimiter | null = null;
		for (; openerIndex >= bottomIndex; openerIndex--) {
			const candidate = stack[openerIndex];
			if (!candidate.canOpen) continue;
			if (candidate.type !== closer.type) continue;
			if (closer.type === '~' && candidate.length !== closer.length) continue;
			if (
				(closer.canOpen || candidate.canClose) &&
				closer.type !== '~' &&
				!((candidate.length + closer.length) % 3) &&
				(candidate.length % 3 !== 0 || closer.length % 3 !== 0)
			) {
				continue;
			}
			opener = candidate;
			break;
		}
		// 若未找到
		if (!opener) {
			openersBottom.set(key, closerIndex);
			if (closer.canOpen) {
				closerIndex++;
			} else {
				stack.splice(closerIndex, 1);
			}
			continue;
		}
		// AST
		const nodes = pickNodes(opener.node, closer.node);
		if (!nodes) {
			stack.splice(openerIndex, 1);
			closerIndex = Math.max(closerIndex - 1, 0);
			continue;
		}
		const node = new (getEmphClass(opener, closer))(opener, nodes);
		opener.node.after(node);
		const length = getEmphLength(node);
		// 分隔符
		stack.splice(openerIndex + 1, closerIndex - openerIndex - 1);
		closerIndex = openerIndex + 1;
		closer.length -= length;
		closer.node.raw = closer.node.raw.slice(length);
		if (closer.length === 0) {
			closer.node.remove();
			stack.splice(closerIndex, 1);
		}
		opener.length -= length;
		opener.node.raw = opener.node.raw.slice(length);
		if (opener.length === 0) {
			opener.node.remove();
			stack.splice(openerIndex, 1);
			closerIndex--;
		}
	}
}

//#region Link & Image

/** 链接节点 */
export class LinkNode extends Node {
	constructor(destination: string, title?: string, label?: string) {
		super('link', 'inline');
		this.#destination = destination;
		this.#title = title;
		this.#label = label;
	}
	#destination: string;
	get destination() {
		return this.#destination;
	}
	#title?: string;
	get title() {
		return this.#title;
	}
	#label?: string;
	get label() {
		return this.#label;
	}
}

/** 图像节点 */
export class ImageNode extends Node {
	constructor(destination: string, title?: string, label?: string) {
		super('image', 'inline');
		this.#destination = destination;
		this.#title = title;
		this.#label = label;
	}
	#destination: string;
	get destination() {
		return this.#destination;
	}
	#title?: string;
	get title() {
		return this.#title;
	}
	#label?: string;
	get label() {
		return this.#label;
	}
}

function processLink(
	stack: Delimiter[],
	refMap: RefMap,
	start: number,
	end: number,
): number {
	const opener = stack[start];
	const closer = stack[end];
	const isLink = opener.type === '[';
	// 若不活跃，移除
	if (!opener.active) return removeDelimiter(stack, start, end);
	// [] 中内容
	const precededNodes = pickNodes(opener.node, closer.node);
	if (!precededNodes) return removeDelimiter(stack, start, end);
	// 后续节点
	const followedNodes = pickNodesHasRaw(closer.node);
	const followed = nodesToRaw(followedNodes) ?? '';
	// 解析
	const info = getLinkInfo(refMap, precededNodes, followed);
	if (!info) return removeDelimiter(stack, start, end);
	// 修改 AST
	const node = new (isLink ? LinkNode : ImageNode)(
		info.destination,
		info.title,
		info.label,
	);
	if (info.preceded) {
		node.raw =
			opener.node.raw +
			info.preceded +
			closer.node.raw +
			followed.slice(0, info.length);
	}
	closer.node.after(node);
	opener.node.remove();
	node.append(...precededNodes);
	closer.node.remove();
	removeNodesByStringLength(followedNodes, info.length);
	// 分隔符
	if (isLink) {
		for (let i = 0; i <= start; i++) {
			const delimiter = stack[i];
			if (delimiter.type !== '[') continue;
			delimiter.active = false;
		}
	}
	processEmph(stack.splice(start, end - start + 1).slice(1, -1));
	Text.normalize(node);
	return start - 1;
}

//#region Main

function parse(root: Node, refMap: RefMap, options?: EmphasisAndLinkOption) {
	Text.normalize(root);
	const stacks = createStacks(root, options);
	for (const stack of stacks) {
		// 链接 & 图像
		DELIMITER: for (let i = 0; i < stack.length; i++) {
			const delimiter = stack[i];
			if (delimiter.type !== ']') continue;
			let j = i - 1;
			// 查找开符
			while (j >= 0) {
				if (stack[j].type === '[' || stack[j].type === '![') {
					i = processLink(stack, refMap, j, i);
					continue DELIMITER;
				}
				j--;
			}
			// 没有匹配开符
			stack.splice(i, 1);
			i--;
		}
		// 强调
		processEmph(stack);
	}
	Text.normalize(root);
}

const PATTERN_TAG_OPEN =
	/<[A-Za-z][A-Za-z\d-]*([ \t\n]*[A-Za-z_:][A-Za-z\d_.:-]*([ \t]*\n?[ \t]*=[ \t]*\n?[ \t]*([^ \t\n"'=<>]+|'[^']*'|"[^"]*"))?)*[ \t]*\n?[ \t]*\/?>/g;
const PATTERN_TAG_CLOSE = /<\/[A-Za-z][A-Za-z\d-]*[ \t]*\n?[ \t]*>/g;

function removeHTMLTags(source: string) {
	return source.replace(PATTERN_TAG_OPEN, '').replace(PATTERN_TAG_CLOSE, '');
}

/**
 * 强调、删除线、链接、图像
 * @see https://spec.commonmark.org/0.31.2/#an-algorithm-for-parsing-nested-emphasis-and-links
 */
export function emphasisAndLink(
	options?: EmphasisAndLinkOption,
): ASTPlugin<'inline', EmphNode | StrongNode | DelNode | ImageNode | LinkNode> {
	if (options) options = { ...options };
	const resolve = options?.targetResolver ?? DEFAULT_RESOLVER;
	return {
		name: 'emphasis-and-links',
		type: 'inline',
		phase: 'post',
		priority: 0,
		parse(root, { refMap }) {
			let checked = false;
			for (const node of root.entires()) {
				if (node instanceof Text) {
					checked = true;
					break;
				}
			}
			if (!checked) return;
			parse(root, refMap, options);
		},
		verifyNode(
			node,
		): node is EmphNode | StrongNode | DelNode | ImageNode | LinkNode {
			if (node instanceof EmphNode) return true;
			if (node instanceof StrongNode) return true;
			if (node instanceof DelNode) return true;
			if (node instanceof ImageNode) return true;
			if (node instanceof LinkNode) return true;
			return false;
		},
		render(node) {
			const html = [...node.entires().map((node) => node.html)];
			if (node instanceof EmphNode) return $('em', html);
			if (node instanceof StrongNode) return $('strong', html);
			if (node instanceof DelNode) return $('del', html);
			if (node instanceof ImageNode) {
				return $('img', {
					attr: {
						src: node.destination,
						title: node.title,
						alt: removeHTMLTags(html.join('')),
					},
				});
			}
			const target = resolve(node.destination);
			return $('a', {
				attr: {
					href: node.destination,
					target: target ? `_${target}` : null,
					title: node.title,
				},
				html,
			});
		},
	};
}
