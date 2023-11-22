/**
 * Copied from @vueuse/shared under The MIT License
 *
 * ref: https://github.com/vueuse/vueuse/blob/v10.6.1/packages/shared/makeDestructurable/index.ts
 * license: https://github.com/vueuse/vueuse/blob/v10.6.1/LICENSE
 */

/**
 * Make isomorphic destructurable for object and array at the same time.
 */
export function makeDestructurable<
	T extends Record<string, unknown>,
	A extends readonly any[],
>(obj: T, arr: A): T & A {
	if (typeof Symbol !== 'undefined') {
		const clone = { ...obj }

		Object.defineProperty(clone, Symbol.iterator, {
			enumerable: false,
			value() {
				let index = 0
				return {
					next: () => ({
						value: arr[index++],
						done: index > arr.length,
					}),
				}
			},
		})

		return clone as T & A
	}
	else {
		return Object.assign([...arr], obj) as unknown as T & A
	}
}
