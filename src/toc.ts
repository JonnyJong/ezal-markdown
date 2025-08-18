import { Anchors } from './anchor';

export interface TocItem {
	/** 名称 */
	name: string;
	/** 锚 */
	anchor: string;
	/** 级别 */
	level: number;
}

/** 目录 */
export class Toc {
	#anchors: Anchors;
	#items: Readonly<TocItem>[] = [];
	/**
	 * @param anchors 锚
	 * @param toc 源目录，若指定源目录，将复制源目录内容，但不会在 anchors 中添加名称
	 */
	constructor(anchors: Anchors, toc?: Toc) {
		if (!(anchors instanceof Anchors)) {
			throw new Error('Require a instance of Anchors');
		}
		this.#anchors = anchors;
		if (!(toc instanceof Toc)) return;
		for (const item of toc) {
			this.#items.push({ ...item });
		}
	}
	get anchors() {
		return this.#anchors;
	}
	/**
	 * 添加目录项
	 * @param name 名称
	 * @param level 级别
	 * @param anchor 自定义锚
	 * @returns 实际锚
	 */
	register(name: string, level: number, anchor?: string): string {
		anchor = this.#anchors.register(name, anchor);
		this.#items.push({ name, level, anchor });
		return anchor;
	}
	entires() {
		return this.#items.entries();
	}
	values() {
		return this.#items.values();
	}
	[Symbol.iterator]() {
		return this.#items[Symbol.iterator]();
	}
	toMarkdown() {
		return this.#items
			.map(({ name, anchor, level }) => {
				return `${'  '.repeat(level - 1)}- [${name}](#${anchor})`;
			})
			.join('\n');
	}
}
