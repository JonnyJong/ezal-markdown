//#region Queue

import { decodeHTML5Strict } from 'entities';
import type { MappedNested, Nested, PromiseOr } from './types';

interface QueueItem<T> {
	data: T;
	next: QueueItem<T> | null;
}

export class Queue<T> {
	#first: QueueItem<T> | null = null;
	#last: QueueItem<T> | null = null;
	enqueue(data: T) {
		const item: QueueItem<T> = { data, next: null };
		if (this.#last) {
			this.#last.next = item;
			this.#last = item;
		} else {
			this.#first = item;
			this.#last = item;
		}
	}
	dequeue(): T | null {
		if (!this.#first) return null;
		const data = this.#first.data;
		this.#first = this.#first.next;
		if (!this.#first) this.#last = null;
		return data;
	}
	get isEmpty(): boolean {
		return this.#first === null;
	}
}

//#region Nested

type Iter<T> = Generator<[key: string | number, value: T], void, void>;
function* iter<T>(input: unknown): Iter<T> {
	if (!isObject(input)) return;
	if (Array.isArray(input)) {
		for (const kv of input.entries()) {
			yield kv;
		}
		return;
	}
	for (const kv of Object.entries(input)) {
		yield kv;
	}
}
export async function mutateNested<A, B, T extends Nested<A> = Nested<A>>(
	input: T,
	validator: (value: unknown) => value is A,
	transformer: (value: A) => PromiseOr<B>,
): Promise<MappedNested<T, A, B>> {
	if (validator(input)) return (await transformer(input)) as any;

	const stack: [Iter<T>, { [k: string | number]: any }][] = [
		[iter(input), input as object],
	];
	const temp: [Iter<T>, { [k: string | number]: any }][] = [];

	while (true) {
		const next = stack.pop();
		if (!next) break;
		const [it, obj] = next;
		for (const [k, v] of it) {
			if (validator(v)) {
				obj[k] = await transformer(v);
				continue;
			}
			temp.push([iter(v), v as object]);
		}
		while (true) {
			const item = temp.pop();
			if (!item) break;
			stack.push(item);
		}
	}

	return input as any;
}
export function* entiresNested<T>(
	input: Nested<T>,
	validator: (value: unknown) => value is T,
): Generator<T, void, void> {
	if (validator(input)) {
		yield input;
		return;
	}

	const stack: [Iter<T>, { [k: string | number]: any }][] = [
		[iter(input), input as object],
	];
	const temp: [Iter<T>, { [k: string | number]: any }][] = [];

	while (true) {
		const next = stack.pop();
		if (!next) break;
		for (const [_, v] of next[0]) {
			if (validator(v)) {
				yield v;
				continue;
			}
			temp.push([iter(v), v as object]);
		}
		while (true) {
			const item = temp.pop();
			if (!item) break;
			stack.push(item);
		}
	}
}

//#region Map
export class OrderedPositionMap<T> {
	#keys: number[] = [];
	#map: Map<number, T[]> = new Map();
	#compare: (a: T, b: T) => number;
	constructor(compare: (a: T, b: T) => number) {
		this.#compare = compare;
	}
	#insertKey(key: number) {
		let i = this.#keys.length;
		while (i > 0 && this.#keys[i - 1] < key) i--;
		this.#keys.splice(i, 0, key);
	}
	#insertValue(items: T[], value: T) {
		let i = items.length;
		while (i > 0 && this.#compare(value, items[i - 1]) > 0) i--;
		items.splice(i, 0, value);
	}
	/** 添加到指定位置 */
	add(index: number, value: T): void {
		let items = this.#map.get(index);
		if (!items) {
			items = [];
			this.#map.set(index, items);
			this.#insertKey(index);
		}
		this.#insertValue(items, value);
	}
	/** 取出所有小于指定位置索引的插件 */
	takeAllBelow(index: number): T[] {
		const result: T[] = [];

		const length = this.#keys.lastIndexOf(index) + 1;
		if (length === -1) return result;
		const keys = this.#keys.slice(length);
		this.#keys = this.#keys.slice(0, length);

		for (const key of keys) {
			result.push(...this.#map.get(key)!);
			this.#map.delete(key);
		}

		return result;
	}
	/** 按最小位置顺序取出 */
	*entires(): Generator<[index: number, value: T], void, void> {
		while (this.#keys.length > 0) {
			const key = this.#keys.at(-1)!;
			const items = this.#map.get(key)!;
			const value = items.pop()!;
			if (items.length === 0) {
				this.#map.delete(key);
				this.#keys.pop();
			}
			yield [key, value];
		}
	}
}

//#region Html

const PATTERN_HTML_CHAR = /[&<>"']/g;
const HTML_ESCAPE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};
/** 转义 HTML */
export function escapeHTML(text: string): string {
	return text.replace(PATTERN_HTML_CHAR, (char) => HTML_ESCAPE_MAP[char]);
}

export interface HTMLTagCreateOptions {
	/**
	 * 属性
	 * @description
	 * - `true` -> `<key>`
	 * - `number | string` -> `<key>=<value>`
	 * - 其他 -> 忽略
	 */
	attr?: Record<string, any>;
	/** 类名 */
	class?: string | string[];
	/** ID */
	id?: string;
	/**
	 * 数据
	 * @description
	 * - `true` -> `data-<key>`
	 * - `number | string` -> `data-<key>=<value>`
	 * - 其他 -> 忽略
	 */
	data?: Record<string, any>;
	/**
	 * 样式
	 * @description
	 * - 键名 `backgroundColor` -> `--background-color`
	 * - 键名 `$varName` -> `--var-name`
	 * - 键值 `red` -> `red`
	 * - 键值 `12` -> `12px`
	 * - 键值 `$primaryColor` -> `var(--primary-color)`
	 * - 其他类型键值将被忽略
	 */
	style?: Record<string, any>;
	/** 内容（HTML 字符不转义） */
	html?: string | string[];
	/** 内容（HTML 字符会被转义） */
	content?: string | string[];
}

export const VOID_ELEMENTS: readonly string[] = Object.freeze([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
]);
const PATTERN_CSS_VAR_DECLARE = /^\$/;
const PATTERN_CSS_UPPER = /[A-Z]/g;
const PATTERN_CSS_VAR = /\$[A-Za-z][A-Za-z0-9]*/g;

type HTMLTagName =
	| 'a'
	| 'abbr'
	| 'address'
	| 'area'
	| 'article'
	| 'aside'
	| 'audio'
	| 'b'
	| 'base'
	| 'bdi'
	| 'bdo'
	| 'blockquote'
	| 'body'
	| 'br'
	| 'button'
	| 'canvas'
	| 'caption'
	| 'cite'
	| 'code'
	| 'col'
	| 'colgroup'
	| 'data'
	| 'datalist'
	| 'dd'
	| 'del'
	| 'details'
	| 'dfn'
	| 'dialog'
	| 'div'
	| 'dl'
	| 'dt'
	| 'em'
	| 'embed'
	| 'fieldset'
	| 'figcaption'
	| 'figure'
	| 'footer'
	| 'form'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'head'
	| 'header'
	| 'hgroup'
	| 'hr'
	| 'html'
	| 'i'
	| 'iframe'
	| 'img'
	| 'input'
	| 'ins'
	| 'kbd'
	| 'label'
	| 'legend'
	| 'li'
	| 'link'
	| 'main'
	| 'map'
	| 'mark'
	| 'menu'
	| 'meta'
	| 'meter'
	| 'nav'
	| 'noscript'
	| 'object'
	| 'ol'
	| 'optgroup'
	| 'option'
	| 'output'
	| 'p'
	| 'picture'
	| 'pre'
	| 'progress'
	| 'q'
	| 'rp'
	| 'rt'
	| 'ruby'
	| 's'
	| 'samp'
	| 'script'
	| 'search'
	| 'section'
	| 'select'
	| 'slot'
	| 'small'
	| 'source'
	| 'span'
	| 'strong'
	| 'style'
	| 'sub'
	| 'summary'
	| 'sup'
	| 'table'
	| 'tbody'
	| 'td'
	| 'template'
	| 'textarea'
	| 'tfoot'
	| 'th'
	| 'thead'
	| 'time'
	| 'title'
	| 'tr'
	| 'track'
	| 'u'
	| 'ul'
	| 'var'
	| 'video'
	| 'wbr'
	| (string & {});

/**
 * 创建 HTML 标签
 * @param tagName 标签名
 * @param html 内容（HTML 字符不转义）
 */
export function $(tagName: HTMLTagName, html?: string | string[]): string;
/**
 * 创建 HTML 标签
 * @param tagName 标签名
 * @param options 参数
 */
export function $(tagName: HTMLTagName, options?: HTMLTagCreateOptions): string;
export function $(
	tagName: HTMLTagName,
	options?: HTMLTagCreateOptions | string | string[],
): string {
	if (typeof options === 'string' || Array.isArray(options)) {
		options = { html: options };
	}
	// Tag Name
	let result = `<${tagName}`;
	// Attr
	const attributes = options?.attr ?? {};
	// Class
	if (options?.class) {
		attributes.class = asArray(options.class).map(escapeHTML).join(' ');
	}
	// ID
	if (options?.id) attributes.id = escapeHTML(options.id);
	// Data
	if (options?.data && typeof options.data === 'object') {
		for (const [k, v] of Object.entries(options.data)) {
			attributes[`data-${k}`] = v;
		}
	}
	// Style
	if (options?.style && typeof options.style === 'object') {
		let css = '';
		for (const [k, v] of Object.entries(options.style)) {
			if (!v) continue;
			let value: string | undefined;
			if (typeof v === 'number') value = `${v}px`;
			else if (typeof v === 'string') {
				value = v.replace(
					PATTERN_CSS_VAR,
					(v) =>
						`var(${v.replace(PATTERN_CSS_VAR_DECLARE, '--').replace(PATTERN_CSS_UPPER, (c) => `-${c.toLowerCase()}`)})`,
				);
			}
			if (!value) continue;
			const key = k
				.replace(PATTERN_CSS_VAR_DECLARE, '--')
				.replace(PATTERN_CSS_UPPER, (c) => `-${c.toLowerCase()}`);
			css += `${key}:${value};`;
		}
		attributes.style = css;
	}
	// Apply Attribute
	for (const [k, v] of Object.entries(attributes)) {
		if (!v) continue;
		if (!['string', 'number', 'boolean'].includes(typeof v)) continue;
		result += ` ${escapeHTML(k)}`;
		if (v === true || v === '') continue;
		result += `="${escapeHTML(String(v))}"`;
	}
	result += '>';
	// Content & HTML
	if (options?.content) {
		result += asArray(options.content).map(escapeHTML).join('');
	} else if (options?.html) {
		result += asArray(options.html).join('');
	}
	// Closing Tag
	if (!VOID_ELEMENTS.includes(tagName)) result += `</${tagName}>`;
	return result;
}

//#region Indent

const PATTERN_INDENT = /^[ \t]*/;
/**
 * 计算首行缩进数
 * @description
 * 根据 CommonMark Spec，制表符将作为 4 个空格计算
 * @see https://spec.commonmark.org/0.31.2/#tabs
 */
export function indentSizeOf(source: string): number {
	const matched = source.match(PATTERN_INDENT)?.[0];
	if (!matched) return 0;
	let size = 0;
	for (const char of matched) {
		if (char === '\t') size += 4;
		else size++;
	}
	return size;
}
/**
 * 移除行首缩进
 * @description
 * 移除对于数量的文本开头空格，若不足，则去除文本开头所有空格；
 * 根据 CommonMark Spec，制表符可等同于 4 个空格
 * @see https://spec.commonmark.org/0.31.2/#tabs
 */
export function reduceIndent(
	line: string,
	size: number,
	returnSpaces?: boolean,
): string {
	if (size <= 0) return line;
	let indentText = line.match(PATTERN_INDENT)?.[0];
	if (!indentText) return line;
	const maxLength = indentText.length;
	if (returnSpaces) {
		while (size > 0 && indentText) {
			size--;
			if (indentText[0] === ' ') {
				indentText = indentText.slice(1);
				continue;
			}
			indentText = indentText.slice(1) + ' '.repeat(3);
		}
		return indentText + line.slice(maxLength);
	}
	let i = 0;
	while (i < maxLength && size > 0) {
		i++;
		size--;
		if (line[i - 1] === '\t') size -= 3;
	}
	return line.slice(i);
}

//#region Other

export function isObject(value: unknown): value is object {
	return !!value && typeof value === 'object';
}

export function mergeMap<K, V>(target: Map<K, V>, source: Map<K, V>) {
	for (const [k, v] of source) {
		target.set(k, v);
	}
}

export function omit<T extends object, K extends keyof any>(
	object: T,
	keys: K[],
): Omit<T, K> {
	const result = {} as Omit<T, K>;

	for (const key in object) {
		if (!keys.includes(key as any)) {
			(result as any)[key] = object[key];
		}
	}

	return result;
}

export function asArray<T>(value: T | T[]): T[] {
	if (Array.isArray(value)) return value;
	return [value];
}

export function stackSafeRecursion<Args extends unknown[], Result>(
	fn: (
		rec: (...args: Args) => Promise<Result>,
		...args: Args
	) => PromiseOr<Result>,
): (...args: Args) => Promise<Result>;
export function stackSafeRecursion<
	Fn extends (...args: unknown[]) => Promise<unknown>,
>(fn: (rec: Fn, ...args: Parameters<Fn>) => ReturnType<Fn>): Fn;
export function stackSafeRecursion<
	Fn extends (...args: unknown[]) => Promise<unknown>,
>(fn: (rec: Fn, ...args: Parameters<Fn>) => ReturnType<Fn>): Fn {
	return ((...args: Parameters<Fn>) => {
		const rec = async (...args: Parameters<Fn>): Promise<ReturnType<Fn>> =>
			(await Promise.resolve().then(() => fn(rec as any, ...args))) as any;
		return rec(...args);
	}) as any;
}

/**
 * 逐行读取
 * @description
 * 除最后一行，读取的行结尾都带有换行符
 */
export function* eachLine(
	source: string,
): Generator<[current: string, rest: string], void, void> {
	while (true) {
		const i = source.indexOf('\n') + 1;
		if (!i) {
			yield [source, source];
			return;
		}
		yield [source.slice(0, i), source];
		source = source.slice(i);
	}
}

const PATTERN_ESC =
	/\\([\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E])/g;
export function escapeMarkdown(source: string) {
	return decodeHTML5Strict(source.replace(PATTERN_ESC, (_, c) => c));
}

const PATTERN_EMPTY = /^[ \t\n]*$/;
export function isEmpty(line: string) {
	return PATTERN_EMPTY.test(line);
}
