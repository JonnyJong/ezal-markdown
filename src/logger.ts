import type { NodeType } from './node';

export interface LogData {
	/** 插件类型 */
	type: NodeType;
	/** 插件名称 */
	name: string;
	/** 信息 */
	message: string;
	errObj?: unknown;
}

export interface Logger {
	/** 输出调试日志 */
	debug(data: LogData): void;
	/** 输出一般日志 */
	info(data: LogData): void;
	/** 输出警告日志 */
	warn(data: LogData): void;
	/** 输出错误日志 */
	error(data: LogData): void;
}

export const defaultLogger: Logger = {
	debug(data) {
		(globalThis as any)?.console?.debug?.(data);
	},
	info(data) {
		(globalThis as any)?.console?.info?.(data);
	},
	warn(data) {
		(globalThis as any)?.console?.warn?.(data);
	},
	error(data) {
		(globalThis as any)?.console?.error?.(data);
	},
};
