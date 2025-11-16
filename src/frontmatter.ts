import type {
	DocumentOptions,
	ParseOptions,
	parseAllDocuments,
	parseDocument,
	SchemaOptions,
} from 'yaml';

type YamlModule = typeof import('yaml');

export interface FrontmatterExtractResult {
	/** 原始内容 */
	raw: string;
	/**
	 * 数据值
	 * @description
	 * 若 Front matter 为多文档 yaml，则对应第一个 yaml 文档；
	 * 若启用忽略错误，则为第一个解析成功的 yaml 文档
	 */
	data: unknown;
	/** 所有 yaml 文档内容 */
	content: unknown[];
	/** 错误信息 */
	errors?: unknown[];
}

export type YAMLParseOptions = ParseOptions & DocumentOptions & SchemaOptions;

export interface FrontmatterExtractOptions {
	parse?: Parameters<typeof parseAllDocuments>[1];
	toJS?: Parameters<ReturnType<typeof parseDocument>['toJS']>[0];
	ignoreErrors?: boolean;
}

const PATTERN_WRAP = /\r\n?/g;
const PATTERN_BEGIN = /^-{3,}\n/;

let yaml: YamlModule | undefined;
async function loadYaml(): Promise<YamlModule> {
	if (yaml) return yaml;
	try {
		// @ts-expect-error
		yaml = require('yaml');
		return yaml as YamlModule;
	} catch {}
	try {
		yaml = await import('yaml');
		return yaml;
	} catch {
		throw new Error(`The "yaml" package is required but not installed.`);
	}
}

/** 提取 Front Matter */
export async function extractFrontmatter(
	source: string,
	options?: FrontmatterExtractOptions,
): Promise<FrontmatterExtractResult | undefined> {
	const yaml = await loadYaml();
	source = source.replace(PATTERN_WRAP, '\n');
	const begin = source.match(PATTERN_BEGIN);
	if (!begin) return;
	const delimiterLength = begin[0].length - 1;
	const end = source.match(new RegExp(`(?<=\n)-{${delimiterLength},}(\n|$)`));
	if (!end) return;

	const raw = source.slice(0, end.index! + end[0].length);
	const content = raw.slice(delimiterLength + 1, -end[0].length);
	const data: any[] = [];
	const errors: unknown[] = [];

	let docs: ReturnType<typeof parseAllDocuments>;
	try {
		docs = yaml!.parseAllDocuments(content, options?.parse);
	} catch (error) {
		if (!options?.ignoreErrors) throw error;
		errors.push(error);
		return { raw, data: undefined, content: data, errors };
	}

	for (const doc of docs) {
		try {
			data.push(doc.toJS(options?.toJS));
		} catch (error) {
			if (!options?.ignoreErrors) throw error;
			errors.push(error);
		}
	}

	return {
		raw,
		data: data[0],
		content: data,
		errors: errors.length > 0 ? errors : undefined,
	};
}
