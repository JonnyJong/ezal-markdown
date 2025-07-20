const PATTERN_CJK =
	/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const PATTERN_LATIN = /[\p{Script=Latin}\p{Script=Cyrillic}]+/gu;

export interface Minute2ReadOptions {
	/**
	 * CJK 每分钟字符阅读数
	 * @default 300
	 */
	cjk?: number;
	/**
	 * 拉丁文每分钟单词阅读数
	 * @default 180
	 */
	latin?: number;
}

/** 字数统计 */
export class Counter {
	#cjk = 0;
	#latin = 0;
	/** CJK 字符数 */
	get cjk() {
		return this.#cjk;
	}
	/** 拉丁字母单词数 */
	get latin() {
		return this.#latin;
	}
	/** 总字/词数 */
	get value() {
		return this.#cjk + this.#latin;
	}
	/**
	 * 计算字数
	 * @param source 源文本
	 * @returns 源文本
	 */
	count(source: string): string {
		this.#cjk += source.match(PATTERN_CJK)?.length ?? 0;
		this.#latin += source.match(PATTERN_LATIN)?.length ?? 0;
		return source;
	}
	minute2read(options?: Minute2ReadOptions) {
		const cjk = options?.cjk ?? 300;
		const latin = options?.latin ?? 180;
		return this.#cjk / cjk + this.#latin / latin;
	}
}
