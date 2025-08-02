export type PromiseOr<T> = T | Promise<T>;
export type ArrayOr<T> = T | T[];

export function mergeMap<K, V>(target: Map<K, V>, source: Map<K, V>) {
	for (const [k, v] of source) {
		target.set(k, v);
	}
}

export type Children<T> = T | Children<T>[] | { [key: string]: Children<T> };
export type MapChildren<T, A, B> = T extends A
	? B
	: T extends Children<A>[]
		? MapChildren<T[number], A, B>[]
		: T extends Record<string, Children<A>>
			? { [K in keyof T]: MapChildren<T[K], A, B> }
			: T;

export async function mapChildren<A, B, T extends Children<A>>(
	children: T,
	validator: (value: unknown) => value is A,
	transformer: (value: A) => PromiseOr<B>,
): Promise<MapChildren<T, A, B>> {
	const stack: Array<{
		value: unknown;
		parent: any;
		key: string | number | null;
	}> = [];

	const root = { value: children, parent: null, key: null };
	stack.push(root);

	let result: any = null;

	while (stack.length > 0) {
		const current = stack.pop()!;

		if (validator(current.value)) {
			const transformed = await transformer(current.value as A);

			if (current.parent === null) {
				result = transformed;
			} else if (Array.isArray(current.parent)) {
				current.parent[current.key as number] = transformed;
			} else {
				current.parent[current.key as string] = transformed;
			}
		} else if (Array.isArray(current.value)) {
			const newArray: any[] = [];

			if (current.parent === null) {
				result = newArray;
			} else if (Array.isArray(current.parent)) {
				current.parent[current.key as number] = newArray;
			} else {
				current.parent[current.key as string] = newArray;
			}

			for (let i = current.value.length - 1; i >= 0; i--) {
				stack.push({
					value: current.value[i],
					parent: newArray,
					key: i,
				});
			}
		} else if (typeof current.value === 'object' && current.value !== null) {
			const newObj: Record<string, any> = {};

			if (current.parent === null) {
				result = newObj;
			} else if (Array.isArray(current.parent)) {
				current.parent[current.key as number] = newObj;
			} else {
				current.parent[current.key as string] = newObj;
			}

			const entries = Object.entries(current.value);
			for (let i = entries.length - 1; i >= 0; i--) {
				const [key, value] = entries[i];
				stack.push({
					value,
					parent: newObj,
					key,
				});
			}
		} else if (current.parent === null) {
			result = current.value;
		} else if (Array.isArray(current.parent)) {
			current.parent[current.key as number] = current.value;
		} else {
			current.parent[current.key as string] = current.value;
		}
	}

	return result as MapChildren<T, A, B>;
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

const PATTERN_EMPTY = /^\s*$/;
const PATTERN_SPACE = /^ */;
export function normalizeIndent(content: string, maxIndent = 4): string {
	let lines = content.split('\n');
	let firstLine = lines.shift()!;
	if (firstLine.startsWith(' '.repeat(Math.min(4, maxIndent)))) {
		firstLine = `    ${firstLine.trimStart()}`;
	} else firstLine = firstLine.trimStart();

	let indent = Infinity;
	for (const line of lines) {
		if (PATTERN_EMPTY.test(line)) continue;
		const spaces = line.match(PATTERN_SPACE)?.[0].length || 0;
		if (spaces < indent) indent = spaces;
	}
	if (indent === Infinity) indent = 0;
	indent = Math.min(indent, 4, maxIndent);

	const pattern = new RegExp(`^( {0,${indent}}|\t)`);
	lines = lines.map((line) => line.replace(pattern, ''));

	return [firstLine, ...lines].join('\n');
}

export function asArray<T>(value: T | T[]): T[] {
	if (Array.isArray(value)) return value;
	return [value];
}

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

/**
 * 创建 HTML 标签
 * @param tagName 标签名
 * @param html 内容（HTML 字符不转义）
 */
export function $(
	tagName: keyof HTMLElementTagNameMap | (string & {}),
	html?: string | string[],
): string;
/**
 * 创建 HTML 标签
 * @param tagName 标签名
 * @param options 参数
 */
export function $(
	tagName: keyof HTMLElementTagNameMap | (string & {}),
	options?: HTMLTagCreateOptions,
): string;
export function $(
	tagName: keyof HTMLElementTagNameMap | (string & {}),
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
			let value: string | undefined = undefined;
			if (typeof v === 'number') value = `${v}px`;
			else if (typeof v === 'string') {
				value = v.replace(PATTERN_CSS_VAR, (v) => {
					return `var(${v.replace(PATTERN_CSS_VAR_DECLARE, '--').replace(PATTERN_CSS_UPPER, (c) => `-${c.toLowerCase()}`)})`;
				});
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
		result += `="${escapeHTML(v)}"`;
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

/** 渲染钩子 */
export type RenderHook<T> = ArrayOr<(data: T) => PromiseOr<T>>;

export async function execHooks<T>(data: T, hooks?: RenderHook<T>): Promise<T> {
	if (!hooks) return data;
	if (typeof hooks === 'function') {
		return hooks(data);
	}
	for (const hook of hooks) {
		data = await hook(data);
	}
	return data;
}
