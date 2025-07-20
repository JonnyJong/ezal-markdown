import { describe, expect, it } from 'vitest';
import { mapChildren, mergeMap, omit } from '../src/utils';

describe('Utils: mergeMap', () => {
	it('should merge two maps with different keys', () => {
		const target = new Map([
			['a', 1],
			['b', 2],
		]);
		const source = new Map([
			['c', 3],
			['d', 4],
		]);

		mergeMap(target, source);

		expect(target.size).toBe(4);
		expect(target.get('a')).toBe(1);
		expect(target.get('b')).toBe(2);
		expect(target.get('c')).toBe(3);
		expect(target.get('d')).toBe(4);
	});

	it('should overwrite existing keys in target map', () => {
		const target = new Map([
			['a', 1],
			['b', 2],
		]);
		const source = new Map([
			['b', 20],
			['c', 30],
		]);

		mergeMap(target, source);

		expect(target.size).toBe(3);
		expect(target.get('a')).toBe(1);
		expect(target.get('b')).toBe(20); // 被覆盖
		expect(target.get('c')).toBe(30);
	});

	it('should handle empty source map', () => {
		const target = new Map([
			['a', 1],
			['b', 2],
		]);
		const source = new Map();

		mergeMap(target, source);

		expect(target.size).toBe(2);
		expect(target.get('a')).toBe(1);
		expect(target.get('b')).toBe(2);
	});

	it('should handle empty target map', () => {
		const target = new Map();
		const source = new Map([
			['a', 1],
			['b', 2],
		]);

		mergeMap(target, source);

		expect(target.size).toBe(2);
		expect(target.get('a')).toBe(1);
		expect(target.get('b')).toBe(2);
	});

	it('should handle both empty maps', () => {
		const target = new Map();
		const source = new Map();

		mergeMap(target, source);

		expect(target.size).toBe(0);
	});

	it('should work with different value types', () => {
		const target = new Map<string, any>([
			['a', 1],
			['b', 'two'],
		]);
		const source = new Map<string, any>([
			['b', false],
			['c', { key: 'value' }],
		]);

		mergeMap(target, source);

		expect(target.size).toBe(3);
		expect(target.get('a')).toBe(1);
		expect(target.get('b')).toBe(false); // 被覆盖
		expect(target.get('c')).toEqual({ key: 'value' });
	});

	it('should work with object keys', () => {
		const key1 = { id: 1 };
		const key2 = { id: 2 };
		const target = new Map([[key1, 'value1']]);
		const source = new Map([
			[key2, 'value2'],
			[key1, 'updated'],
		]);

		mergeMap(target, source);

		expect(target.size).toBe(2);
		expect(target.get(key1)).toBe('updated'); // 被覆盖
		expect(target.get(key2)).toBe('value2');
	});

	it('should not affect the source map', () => {
		const target = new Map([['a', 1]]);
		const source = new Map([['b', 2]]);

		mergeMap(target, source);

		expect(source.size).toBe(1);
		expect(source.get('b')).toBe(2);
		expect(source.get('a')).toBeUndefined();
	});
});

describe('Utils: mapChildren', () => {
	// 测试验证函数
	const isNumber = (value: unknown): value is number =>
		typeof value === 'number';
	const isString = (value: unknown): value is string =>
		typeof value === 'string';

	// 简单转换函数
	const double = (n: number) => n * 2;
	const toUpper = (s: string) => s.toUpperCase();

	it('should transform a single primitive value', async () => {
		const result = await mapChildren(5, isNumber, double);
		expect(result).toBe(10);
	});

	it('should transform an array of values', async () => {
		const result = await mapChildren([1, 2, 3], isNumber, double);
		expect(result).toEqual([2, 4, 6]);
	});

	it('should transform an object with values', async () => {
		const result = await mapChildren({ a: 1, b: 2 }, isNumber, double);
		expect(result).toEqual({ a: 2, b: 4 });
	});

	it('should handle nested arrays', async () => {
		const result = await mapChildren([1, [2, [3, 4]]], isNumber, double);
		expect(result).toEqual([2, [4, [6, 8]]]);
	});

	it('should handle nested objects', async () => {
		const input = {
			a: 1,
			b: {
				c: 2,
				d: {
					e: 3,
				},
			},
		};
		const result = await mapChildren(input, isNumber, double);
		expect(result).toEqual({
			a: 2,
			b: {
				c: 4,
				d: {
					e: 6,
				},
			},
		});
	});

	it('should handle mixed arrays and objects', async () => {
		const input = {
			a: [1, 2],
			b: {
				c: [3, { d: 4 }],
			},
		};
		const result = await mapChildren(input, isNumber, double);
		expect(result).toEqual({
			a: [2, 4],
			b: {
				c: [6, { d: 8 }],
			},
		});
	});

	it('should handle different value types', async () => {
		const input = {
			numbers: [1, 2],
			strings: ['a', 'b'],
			mixed: [3, 'c'],
		};

		// 只转换数字
		const numberResult = await mapChildren(input as any, isNumber, double);
		expect(numberResult).toEqual({
			numbers: [2, 4],
			strings: ['a', 'b'],
			mixed: [6, 'c'],
		});

		// 只转换字符串
		const stringResult = await mapChildren(input as any, isString, toUpper);
		expect(stringResult).toEqual({
			numbers: [1, 2],
			strings: ['A', 'B'],
			mixed: [3, 'C'],
		});
	});

	it('should handle empty structures', async () => {
		expect(await mapChildren([], isNumber, double)).toEqual([]);
		expect(await mapChildren({}, isNumber, double)).toEqual({});
	});

	it('should handle async transformer', async () => {
		const asyncDouble = async (n: number) => {
			await new Promise((resolve) => setTimeout(resolve, 10));
			return n * 2;
		};

		const result = await mapChildren([1, 2, 3], isNumber, asyncDouble);
		expect(result).toEqual([2, 4, 6]);
	});

	it('should preserve non-matching values', async () => {
		const input = {
			a: 1,
			b: 'two',
			c: true,
			d: null,
		};
		const result = await mapChildren(input as any, isNumber, double);
		expect(result).toEqual({
			a: 2,
			b: 'two',
			c: true,
			d: null,
		});
	});
});

describe('Utils: omit', () => {
	it('should omit specified keys from object', () => {
		const obj = { a: 1, b: 2, c: 3 };
		const result = omit(obj, ['a', 'c']);
		expect(result).toEqual({ b: 2 });
	});

	it('should return original object when no keys to omit', () => {
		const obj = { a: 1, b: 2 };
		const result = omit(obj, []);
		expect(result).toEqual(obj);
	});

	it('should handle non-existent keys gracefully', () => {
		const obj = { a: 1, b: 2 };
		const result = omit(obj, ['c', 'd'] as any);
		expect(result).toEqual(obj);
	});

	it('should work with nested objects', () => {
		const obj = { a: 1, b: { c: 2, d: 3 }, e: 4 };
		const result = omit(obj, ['a', 'e']);
		expect(result).toEqual({ b: { c: 2, d: 3 } });
	});

	it('should preserve the original object', () => {
		const obj = { a: 1, b: 2 };
		const _result = omit(obj, ['a']);
		expect(obj).toEqual({ a: 1, b: 2 }); // Original unchanged
	});

	it('should work with complex types', () => {
		const obj = { a: 'hello', b: 42, c: true, d: null };
		const result = omit(obj, ['a', 'd']);
		expect(result).toEqual({ b: 42, c: true });
	});

	it('should handle empty objects', () => {
		const obj = {};
		const result = omit(obj, ['a']);
		expect(result).toEqual({});
	});

	it('should maintain type safety', () => {
		const obj = { name: 'Alice', age: 30, active: true };
		const result = omit(obj, ['age']);

		// Type assertions
		expect(result.name).toBe('Alice');
		expect(result.active).toBe(true);
		// @ts-expect-error - age should be omitted
		expect(result.age).toBeUndefined();
	});
});
