/** 链接引用 */
export interface LinkRef {
	/** 链接标签 */
	label: string;
	/** 链接目的地 */
	destination: string;
	/** 链接标题 */
	title?: string;
}

const PATTERN_LABEL_SPACE = /[ \t\n]+/g;
/**
 * 规范化标签
 * @see https://spec.commonmark.org/0.31.2/#matches
 */
export function normalizeLabel(label: string): string {
	return label
		.trim()
		.replace(PATTERN_LABEL_SPACE, ' ')
		.toLowerCase()
		.toUpperCase();
}

/** 链接引用图 */
export class RefMap {
	#map = new Map<string, LinkRef>();
	/**
	 * 设置链接
	 * @param label 链接标签
	 * @param link 链接
	 * @returns 若存在相同标签链接，返回 false
	 * @throws 类型错误时抛出错误
	 */
	set(label: string, link: Omit<LinkRef, 'label'> | string): boolean {
		if (typeof link === 'string') link = { destination: link };
		else if (typeof link?.destination !== 'string') {
			throw new TypeError(
				`link.destination should be a string, but received "${link?.destination}"`,
			);
		}
		label = normalizeLabel(label);
		if (this.#map.has(label)) return false;
		this.#map.set(label, {
			label,
			destination: link.destination,
			title: link.title ? String(link.title) : undefined,
		});
		return true;
	}
	/**
	 * 获取链接
	 * @param label 链接标签
	 */
	get(label: string): LinkRef | undefined {
		label = normalizeLabel(label);
		const link = this.#map.get(label);
		if (!link) return;
		return { ...link };
	}
}
