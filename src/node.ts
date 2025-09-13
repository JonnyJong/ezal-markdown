import { Nested, Parsed, SafeAny, TokenizeOptions } from './types';
import { Queue, entiresNested, omit } from './utils';

/**
 * 节点类型
 * @description
 * - `block`：块级节点
 * - `inline`：行级节点
 */
export type NodeType = 'block' | 'inline';

export const NODE_TYPES: readonly NodeType[] = Object.freeze([
	'block',
	'inline',
]);

/** 基本节点 */
export class Node implements Partial<TokenizeOptions> {
	/**
	 * @param name 节点对应插件名称
	 * @param type 节点类型
	 */
	constructor(name: string, type: NodeType, options?: Partial<TokenizeOptions>) {
		this.#name = name;
		this.#type = type;
		if (!options) return;
		this.maxLevel = options.maxLevel;
		this.skipParagraphWrapping = options.skipParagraphWrapping;
		this.lineBreak = options.lineBreak;
	}
	/** 节点对应插件名称 */
	get name() {
		return this.#name;
	}
	#name: string;
	/**
	 * 节点类型
	 * @description
	 * - `block`：块级节点
	 * - `inline`：行级节点
	 */
	get type() {
		return this.#type;
	}
	#type: NodeType;
	/**
	 * 节点内最大解析级别
	 * @description
	 * 节点内最大阶级级别不会超过节点级别
	 */
	get maxLevel() {
		return this.#maxLevel;
	}
	set maxLevel(value) {
		if (value === undefined) {
			this.#maxLevel = undefined;
			return;
		}
		if (this.type === 'inline') value = 'inline';
		this.#maxLevel = value;
	}
	#maxLevel?: NodeType;
	/** 节点内跳过段落包裹 */
	get skipParagraphWrapping() {
		return this.#skipParagraphWrapping;
	}
	set skipParagraphWrapping(value) {
		if (typeof value === 'boolean' || value === undefined) {
			this.#skipParagraphWrapping = value;
		}
	}
	#skipParagraphWrapping?: boolean;
	/** 节点内换行规则 */
	get lineBreak() {
		return this.#lineBreak;
	}
	set lineBreak(value) {
		if (value === undefined) {
			this.#lineBreak = value;
			return;
		}
		if (!['common-mark', 'soft'].includes(value)) return;
		this.#lineBreak = value;
	}
	#lineBreak?: TokenizeOptions['lineBreak'];
	resolveOptions(): TokenizeOptions {
		let maxLevel = this.#type === 'inline' ? 'inline' : this.#maxLevel;
		const skipParagraphWrapping = this.#skipParagraphWrapping ?? false;
		let lineBreak = this.#lineBreak;
		let node = this.parent;
		while (node && (maxLevel === undefined || lineBreak === undefined)) {
			if (maxLevel === undefined && node.#maxLevel !== undefined) {
				maxLevel = node.#maxLevel;
			}
			if (lineBreak === undefined && node.lineBreak !== undefined) {
				lineBreak = node.lineBreak;
			}
			node = node.parent;
		}
		if (maxLevel === undefined) maxLevel = this.#type;
		if (lineBreak === undefined) lineBreak = 'common-mark';
		return { maxLevel, skipParagraphWrapping, lineBreak };
	}
	getOptions(): Partial<TokenizeOptions> {
		return {
			maxLevel: this.#maxLevel,
			skipParagraphWrapping: this.#skipParagraphWrapping,
			lineBreak: this.#lineBreak,
		};
	}
	/** 父节点 */
	get parent() {
		return this.#parent;
	}
	#parent: Node | null = null;
	/** 子节点列表 */
	#children: Node[] = [];
	/** 获取子节点数量 */
	get size() {
		return this.#children.length;
	}
	/** 遍历子节点 */
	*entires(): Generator<Node, void, void> {
		for (const child of this.#children) {
			yield child;
		}
	}
	/**
	 * 获取索引对应的子节点
	 * @description
	 * 允许正数和负数索引，负数从节点列表的最后一个元素开始倒数
	 */
	child(index: number): Node | null {
		return this.#children.at(index) ?? null;
	}
	/**
	 * 获取当前节点在父节点的子节点列表中的索引值
	 * @description
	 * 若当前节点无父节点，返回 -1
	 */
	getIndex(): number {
		if (!this.#parent) return -1;
		return this.#parent.#children.indexOf(this);
	}
	/** 检查 node 是否为当前节点或当前节点的后代节点 */
	contains(node: Node): boolean {
		if (!(node instanceof Node)) return false;
		if (node === this) return true;

		const queue = new Queue<Node>();
		queue.enqueue(this);

		while (true) {
			const current = queue.dequeue();
			if (!current) return false;
			for (const child of current.#children) {
				if (child === node) return true;
				if (child.#children.length === 0) continue;
				queue.enqueue(child);
			}
		}
	}
	/**
	 * 获取子节点列表切片数组
	 * @param start
	 * 切片起始索引：
	 * - 若为负数，则从末尾开始计算；
	 * - 若 start < -node.size 或省略，则使用 0；
	 * - 若 start >= node.size，则从列表结尾开始切片；
	 * 切片起始节点：
	 * - 若起始节点不为当前节点的子节点，返回空数组；
	 * - 若省略起始节点，则使用子节点列表中的第一个节点；
	 * @param end
	 * 切片终止索引：
	 * - 若为负数，则从末尾开始计算；
	 * - 若 end < -node.size，则使用 0；
	 * - 若 end >= node.size 或省略，则从列表结尾终止切片；
	 * - 若 end 规范化后小于 start，则变为 start 值；
	 * 切片终止节点：
	 * - 若起始节点不为当前节点的子节点，返回空数组；
	 * - 若省略终止节点，则使用子节点列表中的最后一个节点；
	 * - 若终止节点位于起始节点前，则返回空数组；
	 * @description
	 * 修改切片数组不会影响子节点列表
	 */
	slice(start?: number | Node, end?: number | Node): Node[] {
		const size = this.#children.length;
		// Start
		if (!start) start = 0;
		else if (start instanceof Node) {
			start = this.#children.indexOf(start);
			if (start === -1) return [];
		} else if (start < -size) start = 0;
		else if (start >= size) start = size;
		// End
		if (!end) end = size;
		else if (end instanceof Node) {
			end = this.#children.indexOf(end) + 1;
			if (end === 0) return [];
		} else if (end < -size) end = 0;
		else if (end >= size) end = size;
		if (end < start) end = start;
		// Slice
		return this.#children.slice(start, end);
	}
	/**
	 * 检查待插入节点
	 * @description
	 * 节点数组中若有节点符合以下情况，返回 false
	 * - 为当前节点
	 * - 为当前节点的祖先节点
	 * - 不为 Node 类或不为 Node 派生类实例
	 */
	#isInsertable(nodes: Node[]): boolean {
		let current: Node = this;
		const paths: Node[] = [this];
		while (current.#parent) {
			current = current.#parent;
			paths.push(current);
		}

		for (const node of nodes) {
			if (!(node instanceof Node)) return false;
			if (paths.includes(node)) return false;
		}
		return true;
	}
	/**
	 * 替换当前节点的子节点列表
	 * @returns
	 * 若替换的节点中包含当前节点或当前节点的祖先节点时，
	 * 替换不会执行，并返回 false
	 */
	replace(...nodes: Node[]): boolean {
		if (!this.#isInsertable(nodes)) return false;
		while (true) {
			const child = this.#children.pop();
			if (!child) break;
			child.#parent = null;
		}
		for (const node of nodes) {
			node.remove();
			node.#parent = this;
		}
		this.#children.push(...nodes);
		return true;
	}
	/**
	 * 在当前节点的子节点列表中特定索引插入一系列节点
	 * @description
	 * 允许正数和负数索引，负数从节点列表的最后一个元素开始倒数；
	 * 若索引位置超出边界，则自动将索引限制到边界值；
	 * 插入的节点会从父节点中移除；
	 * @returns
	 * 若插入的节点中包含当前节点或当前节点的祖先节点时，
	 * 替换不会执行，并返回 false
	 * @example
	 * index === 0 || index <= -3;
	 * <this>
	 * 	// 在此处插入
	 *  <child/>
	 *  <child/>
	 * </this>
	 * @example
	 * index = -1 || index >= 2;
	 * <this>
	 *  <child/>
	 *  <child/>
	 * 	// 在此处插入
	 * </this>
	 */
	insert(index: number, ...nodes: Node[]): boolean {
		if (!this.#isInsertable(nodes)) return false;
		index = Math.trunc(index);
		if (index > this.#children.length) {
			index = this.#children.length;
		} else if (index < 0) {
			index = this.#children.length + index + 1;
			if (index < 0) index = 0;
		}
		for (const node of nodes) {
			const i = this.#children.indexOf(node);
			node.remove();
			node.#parent = this;
			if (i === -1 || i >= index) continue;
			index--;
		}
		this.#children.splice(index, 0, ...nodes);
		return true;
	}
	/**
	 * 在父节点的子节点列表中，该节点前插入一系列节点
	 * @returns
	 * 若当前节点无父节点，
	 * 或插入的节点中包含当前节点或当前节点的祖先节点时，
	 * 替换不会执行，并返回 false
	 * @example
	 * <parent>
	 * 	// 在此处插入
	 *  <this/>
	 * </parent>
	 */
	before(...nodes: Node[]): boolean {
		if (!this.#parent) return false;
		return this.#parent.insert(this.getIndex(), ...nodes);
	}
	/**
	 * 在当前节点的子节点列表开头插入一系列节点
	 * @returns
	 * 若插入的节点中包含当前节点或当前节点的祖先节点时，
	 * 替换不会执行，并返回 false
	 * @example
	 * <this>
	 * 	// 在此处插入
	 *  <child/>
	 * </this>
	 */
	prepend(...nodes: Node[]): boolean {
		return this.insert(0, ...nodes);
	}
	/**
	 * 在当前节点的子节点列表结尾插入一系列节点
	 * @returns
	 * 若插入的节点中包含当前节点或当前节点的祖先节点时，
	 * 替换不会执行，并返回 false
	 * @example
	 * <this>
	 *  <child/>
	 * 	// 在此处插入
	 * </this>
	 */
	append(...nodes: Node[]): boolean {
		return this.insert(-1, ...nodes);
	}
	/**
	 * 在父节点的子节点列表中，该节点后插入一系列节点
	 * @returns
	 * 若当前节点无父节点，
	 * 或插入的节点中包含当前节点或当前节点的祖先节点时，
	 * 替换不会执行，并返回 false
	 * @example
	 * <parent>
	 *  <this/>
	 * 	// 在此处插入
	 * </parent>
	 */
	after(...nodes: Node[]): boolean {
		if (!this.#parent) return false;
		return this.#parent.insert(this.getIndex() + 1, ...nodes);
	}
	/**
	 * 从父节点的节点列表中移除该节点
	 * @returns 若当前节点无父节点，返回 false
	 */
	remove(): boolean {
		if (!this.#parent) return false;
		this.#parent.#children.splice(this.getIndex(), 1);
		this.#parent = null;
		return true;
	}
	/** 获取上一个相邻的节点 */
	prev(): Node | null {
		if (!this.#parent) return null;
		return this.#parent.#children[this.getIndex() - 1] ?? null;
	}
	/** 获取下一个相邻的节点 */
	next(): Node | null {
		if (!this.#parent) return null;
		return this.#parent.#children[this.getIndex() + 1] ?? null;
	}
	/** 节点附加调试信息 */
	protected extraDebugInfo?(): string;
	#getNodeString() {
		return (this.#type === 'inline' ? '#' : '') + this.#name;
	}
	/**
	 * 节点转换为字符串
	 * @description
	 * 仅适合用于调试
	 */
	toString(): string {
		let result = this.#getNodeString();
		if (this.extraDebugInfo) result += `(${this.extraDebugInfo()})`;
		if (this.#children.length === 0) return result;
		result += ' {';
		const stack = [this.#children.values()];
		while (true) {
			const iter = stack.at(-1);
			if (!iter) break;
			const next = iter.next();
			if (!next.value) {
				stack.pop();
				result += `\n${' '.repeat(stack.length * 2)}}`;
				continue;
			}
			const node = next.value;
			result += `\n${' '.repeat(stack.length * 2)}`;
			result += node.#getNodeString();
			if (node.extraDebugInfo) result += `(${node.extraDebugInfo()})`;
			if (node.#children.length) {
				result += ' {';
				stack.push(node.#children.values());
			}
		}
		return result;
	}
	/** 节点对应原始字符串 */
	raw?: string;
	/**
	 * 节点 HTML
	 * @description
	 * 渲染 HTML 时生成
	 */
	html = '';
}

export interface TextNormalizeOptions {
	/** 移除每行文本开头空格 */
	trimStart?: boolean;
	/** 移除节点列表中最后一个文本节点行尾 */
	trimEnd?: boolean;
	/**
	 * 移除位于块节点前文本节点行尾
	 * @description
	 * 需同时启用 `trimEnd`
	 */
	trimEndBeforeBlock?: boolean;
}

/** 文本节点 */
export class Text extends Node {
	constructor(value?: string, options?: Partial<TokenizeOptions>) {
		super('text', 'inline', options);
		this.raw = value ?? '';
	}
	order?: number;
	raw: string;
	replace(..._nodes: Node[]): boolean {
		return false;
	}
	insert(_index: number, ..._nodes: Node[]): boolean {
		return false;
	}
	prepend(..._nodes: Node[]): boolean {
		return false;
	}
	append(..._nodes: Node[]): boolean {
		return false;
	}
	/**
	 * 分裂
	 * @description
	 * 相同的索引值将被合并，超出文本索引范围的索引将被忽略；
	 * 返回分裂后的文本节点数组，若没有进行分裂，返回只包含当前节点的数组
	 */
	splitAt(...indexes: number[]): Text[] {
		indexes = indexes
			.filter((v, i, a) => v > 0 && v < this.raw.length && a.indexOf(v) === i)
			.sort((a, b) => a - b);
		if (indexes.length === 0) return [this];
		const nodes: Text[] = [];
		const options = this.getOptions();
		nodes.push(new Text(this.raw.slice(0, indexes[0]), options));
		for (const [i, index] of indexes.entries()) {
			nodes.push(new Text(this.raw.slice(index, indexes[i + 1]), options));
		}
		this.before(...nodes);
		this.remove();
		return nodes;
	}
	protected extraDebugInfo(): string {
		return this.raw
			.replaceAll('\\', '\\\\')
			.replaceAll('\n', '\\n')
			.replaceAll(')', '\\)');
	}
	/**
	 * 正则化
	 * @description
	 * 正则化作用与 `root` 节点的子节点：
	 * - 合并配置相同的文本节点
	 * - 移除空白文本节点
	 * - 移除每行文本开头空格（需显式启用）
	 * - 移除节点列表中最后一个文本节点行尾（需显式启用）
	 *   - 移除位于块节点前文本节点行尾（需显式启用）
	 */
	static normalize(root: Node, options?: TextNormalizeOptions) {
		removeEmptyText(root);
		mergeText(root);
		if (!(options?.trimStart || options?.trimEnd)) return;
		if (options.trimStart) trimLineStart(root);
		if (options.trimEnd) trimTextEnd(root, options.trimEndBeforeBlock);
		removeEmptyText(root);
		mergeText(root);
	}
}

function removeEmptyText(root: Node) {
	for (let i = 0; ; i++) {
		const node = root.child(i);
		if (!node) return;
		if (!(node instanceof Text)) continue;
		if (node.raw.length) continue;
		node.remove();
		i--;
	}
}

function mergeText(root: Node) {
	for (let i = 0; ; i++) {
		const node = root.child(i);
		if (!node) return;
		if (!(node instanceof Text)) continue;
		const options = node.getOptions();
		while (true) {
			const next = node.next();
			if (!next) return;
			if (!(next instanceof Text)) {
				i++;
				break;
			}
			const opt = next.getOptions();
			if (opt.maxLevel !== options.maxLevel) break;
			if (opt.skipParagraphWrapping !== options.skipParagraphWrapping) break;
			if (opt.lineBreak !== options.lineBreak) break;
			node.raw += next.raw;
			next.remove();
		}
	}
}

function trimTextEnd(root: Node, trimBeforeBlock?: boolean) {
	for (let i = 0; ; i++) {
		const node = root.child(i);
		if (!node) return;
		if (!(node instanceof Text)) continue;
		const next = node.next();
		if (!next) {
			node.raw = node.raw.trimEnd();
			continue;
		}
		if (!trimBeforeBlock) continue;
		if (next.type !== 'block') continue;
		node.raw = node.raw.trimEnd();
	}
}

const PATTERN_LINE_BEGIN_WHITESPACE = /(?<=^|\n)[ \t]+/g;
function trimLineStart(root: Node) {
	for (let i = 0; ; i++) {
		const node = root.child(i);
		if (!node) return;
		if (!(node instanceof Text)) continue;
		node.raw = node.raw.replace(PATTERN_LINE_BEGIN_WHITESPACE, '');
	}
}

/** 文档节点/根节点 */
export class Document extends Node {
	constructor(options?: Partial<TokenizeOptions>) {
		super('document', 'block', options);
	}
	before(..._nodes: Node[]) {
		return false;
	}
	after(..._nodes: Node[]) {
		return false;
	}
}

/** 解析结果子节点 */
export class ParsedChild extends Node {
	constructor(
		type: NodeType,
		value: string,
		options?: Partial<TokenizeOptions>,
	) {
		super('item', type, options);
		this.append(new Text(value));
		this.raw = value;
	}
	raw: string;
}

/**
 * 解析结果节点
 * @description
 * 用于非 AST 插件
 */
export class ParsedNode extends Node implements Pick<Parsed, 'raw'> {
	/**
	 * @param name 节点对应插件名称
	 * @param type 节点类型
	 * @param parsed 解析结果
	 */
	constructor(name: string, type: NodeType, parsed: Parsed) {
		super(name, type);
		this.raw = parsed.raw;
		this.data = omit(parsed, ['raw', 'children']);
		if (!parsed.children) return;
		this.children = parsed.children;
		this.append(
			...entiresNested(parsed.children, (v) => v instanceof ParsedChild),
		);
	}
	raw: string;
	children?: Nested<ParsedChild>;
	data: Record<string, SafeAny>;
	protected extraDebugInfo(): string {
		try {
			return JSON.stringify(this.data);
		} catch {
			return 'Failed to serialize data';
		}
	}
}
