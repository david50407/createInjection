import type { DefineComponent, InjectionKey, SlotsType, VNode } from 'vue-demi'
import { defineComponent, provide as vueProvide, inject as vueInject, isVue3, version } from 'vue-demi'

import { makeDestructurable } from './makeDestructurable'

export type ProvideTemplateComponent<T> = DefineComponent<{ value: T }> & {
	new(): {
		$slots: {
			default: (props: Record<string, never>) => VNode[]
		}
	}
}
export type InjectTemplateComponent<T> = DefineComponent & {
	new(): {
		$slots: {
			default: (props: T) => VNode[]
		}
	}
}

export type InjectionPair<T> = readonly [
	ProvideTemplateComponent<T>,
	InjectTemplateComponent<T>,
] & {
	provide: ProvideTemplateComponent<T>,
	inject: InjectTemplateComponent<T>,
}

type InjectedValue<T, K extends InjectionKey<T>> = K extends InjectionKey<infer V> ? V : T

/**
 * This function creates `provide` and `inject` components in pair.
 *
 * @see https://github.com/david50407/createInjection
 */
export const createInjection = <T, K extends InjectionKey<T>>(key: K): InjectionPair<InjectedValue<T, K>> => {
	// compatibility: Vue 2.7 or above
	if (!isVue3 && !version.startsWith('2.7.')) {
		if (process.env.NODE_ENV !== 'production') {
			throw new Error('[create-injection] createInjection only works in Vue 2.7 or above.')
		}
		// @ts-expect-error incompatible
		return
	}

	const provide = defineComponent({
		props: ['value'],
		setup(props, { slots }) {
			vueProvide(key, props.value)

			return () => slots.default?.({})
		},
	}) as ProvideTemplateComponent<InjectedValue<T, K>>

	const inject = defineComponent<Record<string, never>, object, string, SlotsType<{ default(props: K extends InjectionKey<infer V> ? V : T): VNode[] }>>({
		setup(_, { slots }) {
			const context = vueInject(key)

			return () => slots.default?.(context)
		},
	}) as InjectTemplateComponent<InjectedValue<T, K>>

	return makeDestructurable(
		{ provide, inject } as const,
		[ provide, inject ] as const,
	)
}
