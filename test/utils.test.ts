import { describe, expect, it } from 'vitest';
import type { Nested } from '../src/types';
import {
	eachLine,
	indentSizeOf,
	mergeMap,
	mutateNested,
	omit,
	reduceIndent,
	stackSafeRecursion,
} from '../src/utils';

//#region mutateNested
describe('Utils: mutateNested', () => {
	it('convert Nested<string> to Nested<number>', async () => {
		const data: Nested<string> = {
			str: 'Ipsum',
			arr: ['amet', 'sanctus', { sadipscing: 'sit' }, 'erat'],
		};
		const result = await mutateNested<string, number>(
			data,
			(v) => typeof v === 'string',
			(v) => v.length,
		);
		expect(result).toEqual({
			str: 5,
			arr: [4, 7, { sadipscing: 3 }, 4],
		});
	});

	it('keep other values', async () => {
		const symbol = Symbol();
		const data = [1, symbol, 2] as Nested<any>;
		const result = await mutateNested<number, number>(
			data,
			(v) => typeof v === 'number',
			(v) => v,
		);
		expect(result).toEqual([1, symbol, 2]);
	});

	it('keep the original reference', async () => {
		const data: Nested<string> = {
			str: 'Ipsum',
			arr: ['amet', 'sanctus', { sadipscing: 'sit' }, 'erat'],
		};
		const result = await mutateNested<string, number>(
			data,
			(v) => typeof v === 'string',
			(v) => v.length,
		);
		expect(result).toBe(data);
	});
});

//#region mergeMap
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

//#region omit
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

describe('Utils: stackSafeRecursion', () => {
	it('should handle deep recursion without stack overflow', async () => {
		const getSyncDepth = (i: number) => {
			try {
				return getSyncDepth(i + 1);
			} catch {
				return i;
			}
		};
		const deepRecursive = stackSafeRecursion<[number, number], number>(
			(rec, depth, acc) => {
				if (depth <= 0) return acc;
				return rec(depth - 1, acc + 1);
			},
		);
		const depth = getSyncDepth(0) * 2;
		const result = await deepRecursive(depth, 0);
		expect(result).toBe(depth);
	}, 3000);
	it('should work with fibonacci sequence', async () => {
		const fib = stackSafeRecursion<[number], number>(async (rec, n) => {
			if (n <= 1) return n;
			const [a, b] = await Promise.all([rec(n - 1), rec(n - 2)]);
			return a + b;
		});
		expect(await fib(10)).toBe(55);
	});
	it('should work with factorial', async () => {
		const factorial = stackSafeRecursion<[number], number>(async (rec, n) => {
			if (n <= 1) return 1;
			return n * (await rec(n - 1));
		});
		expect(await factorial(5)).toBe(120);
		expect(await factorial(10)).toBe(3628800);
	});
});

describe('Utils: indentSizeOf', () => {
	it('spaces only', () => {
		expect(indentSizeOf('  ')).toBe(2);
	});
	it('tab only', () => {
		expect(indentSizeOf('\t')).toBe(4);
	});
	it('mixed', () => {
		expect(indentSizeOf(' \t ')).toBe(6);
	});
	it('empty', () => {
		expect(indentSizeOf('')).toBe(0);
		expect(indentSizeOf('\n')).toBe(0);
	});
});

describe('Utils: reduceIndent', () => {
	it('spaces only', () => {
		expect(reduceIndent('     a', 4)).toBe(' a');
	});
	it('tab only', () => {
		expect(reduceIndent('\t a', 4)).toBe(' a');
	});
	it('mixed', () => {
		expect(reduceIndent('  \t a', 4)).toBe(' a');
	});
	it('not enough', () => {
		expect(reduceIndent('a', 4)).toBe('a');
		expect(reduceIndent(' a', 4)).toBe('a');
		expect(reduceIndent('  a', 4)).toBe('a');
		expect(reduceIndent('   a', 4)).toBe('a');
	});
});

describe('Utils: eachLine', () => {
	it('empty', () => {
		expect([...eachLine('')]).toEqual([['', '']]);
	});
	it('two empty line', () => {
		expect([...eachLine('\n')]).toEqual([
			['\n', '\n'],
			['', ''],
		]);
	});
	it('normal', () => {
		expect([...eachLine('Hello\nworld!')]).toEqual([
			['Hello\n', 'Hello\nworld!'],
			['world!', 'world!'],
		]);
	});
});
