import { NodeType } from './node';

export interface LogData {
	/** 插件类型 */
	type: NodeType;
	/** 插件名称 */
	name: string;
	message: string;
	errObj?: unknown;
}

export interface Logger {
	debug(data: LogData): void;
	info(data: LogData): void;
	warn(data: LogData): void;
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
