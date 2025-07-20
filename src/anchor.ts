export type Slugifier = (name: string) => string;

const PATTERN_SYMBOLS = /[\p{P}\s]+/gu;
const PATTERN_TRIM = /^-|-$/g;
const PATTERN_WHITESPACE = /\s+/g;
const PATTERN_PUNCTUATORS =
	/[\][!/'"#$%&()*+,./:;<=>?@\\^{|}~`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g;
const PATTERN_TRAILING = /-(\d)+$/;

const SLUGIFY = {
	aggressive: (name) =>
		name
			.trim()
			.replace(PATTERN_SYMBOLS, '-')
			.replace(PATTERN_TRIM, '')
			.toLowerCase(),
	github: (name) =>
		name
			.trim()
			.toLowerCase()
			.replace(PATTERN_WHITESPACE, '-')
			.replace(PATTERN_PUNCTUATORS, '')
			.replace(PATTERN_TRIM, ''),
} as const satisfies Record<string, Slugifier>;

function parse(slug: string): [slug: string, count: number] | undefined {
	const matched = slug.match(PATTERN_TRAILING);
	if (!matched) return;
	const count = parseInt(matched[1]);
	return [slug.slice(0, -matched[0].length), count];
}

export interface AnchorsInit {
	/**
	 * Slug 生成策略
	 * @default `github`
	 */
	slugifyStrategy?: keyof typeof SLUGIFY | Slugifier;
}

/** 锚 */
export class Anchors {
	#slugs = new Map<string, number>();
	#slugifier = SLUGIFY.github;
	constructor(init?: AnchorsInit) {
		if (!init) return;
		if (!init.slugifyStrategy) return;
		if (typeof init.slugifyStrategy === 'function') {
			this.#slugifier = init.slugifyStrategy;
			return;
		}
		if (typeof init.slugifyStrategy !== 'string') return;
		if (init.slugifyStrategy in SLUGIFY) {
			this.#slugifier = SLUGIFY[init.slugifyStrategy];
		}
	}
	/** 生成 Slug */
	slugify(name: string): string {
		return this.#slugifier(name);
	}
	/** 检查某个 Slug 是否已经存在 */
	isExist(slug: string): boolean {
		if (this.#slugs.has(slug)) return true;
		const parsed = parse(slug);
		if (!parsed) return false;
		const count = this.#slugs.get(parsed[0]);
		if (count === undefined) return false;
		return parsed[1] <= count;
	}
	#updateCount(slug: string): number {
		let count = this.#slugs.get(slug);
		if (count === undefined) {
			this.#slugs.set(slug, 0);
			return 0;
		}
		count++;
		this.#slugs.set(slug, count);
		return count;
	}
	/**
	 * 注册名称
	 * @description
	 * 若未指定 slug，则使用 name 生成 slug
	 * @returns 名称对应 slug
	 */
	register(name: string, slug?: string): string {
		if (typeof slug === 'string') {
			const parsed = parse(slug);
			if (parsed) this.#updateCount(parsed[0]);
			else this.#updateCount(slug);
			return slug;
		}
		slug = this.#slugifier(name);
		const count = this.#updateCount(slug);
		if (!count) return slug;
		return `${slug}-${count}`;
	}
}
